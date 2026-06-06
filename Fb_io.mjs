//**************************************************************/
// fb_io.mjs
// Generalised firebase routines
// Written by <George Taylor>, Term 2 2025
//
// All functions begin with fb_
/**************************************************************/
/*******************************************************/
//////////////////////Function Comments method
//Name: Name of the function
//When: (if called by function, name function)
//Job: What it does
//Input: input parameters
//Output: what it returns
/////////////////////////////////
/*******************************************************/
const COL_C = 'white';
const COL_B = '#CD7F32';
console.log('%c fb_io.mjs',
            'color: blue; background-color: white;');
/**************************************************************/
// Imports
/**************************************************************/
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,  }
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { initializeApp }
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  
import { getDatabase, ref, set, remove, get, update, query, orderByChild, limitToFirst, orderByValue, onValue }
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

/**************************************************************/
// EXPORTs
/**************************************************************/
export { fb_initialise, fb_authenticate, fb_detectLoginChange, fb_Logout, fb_attemptLogIn, fb_adminCommands,
  fb_writeRecords, fb_readRecords, fb_sortedRead, fb_registerDetails, fb_remove,fb_onValue };
/**************************************************************/
// Main code
/**************************************************************/
export let userDetails = {
  displayName:'n/a',
  gameName:'n/a',
  email:'n/a',
  photoUrl:'n/a',
  uid:'n/a',
  topScore: 0,
  gender:'n/a',
  age:'n/a',
};

export var adminVal;

if (sessionStorage.getItem("userDetails") != null) {
  userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  adminVal = JSON.parse(sessionStorage.getItem("adminVal"));
}
/**************************************************************/
// Functions
/**************************************************************/
  ///////////////////////////////////
  //Name:fb_initialise()
  //When: main.mjs
  //Job: estableshes connection with firebase
  //Input: N/A
  //Output:N/A
  ////////////////////////////////
  function fb_initialise() {
    console.log('%c fb_initialise(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const FB_GAMECONFIG = {
    apiKey: "AIzaSyB-pYUkOfLB8fA0s1pYCZdMQ4U7i7Fadf0",
    authDomain: "comp-2025-george-taylor-be24d.firebaseapp.com",
    databaseURL: "https://comp-2025-george-taylor-be24d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "comp-2025-george-taylor-be24d",
    storageBucket: "comp-2025-george-taylor-be24d.firebasestorage.app",
    messagingSenderId: "6475325797",
    appId: "1:6475325797:web:39117eb196e136fca0418c"
  };
    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
  getDatabase(FB_GAMEAPP);
  }



///////////////////////////////////
//Name:fb_authenticate()
//When: fb_attemptLogIn()
//Job: opens pop for account authetafication, reads if user is registered and returns true or false
//Input: N/A
//Output: if user is registerd in database (true/false)
////////////////////////////////
function fb_authenticate(){
  console.log('%c fb_authenticate(): ', 
  'color: ' + COL_C + '; background-color: ' + COL_B + ';');
  const AUTH = getAuth();
  const PROVIDER = new GoogleAuthProvider();
  PROVIDER.setCustomParameters({});

  return signInWithPopup(AUTH, PROVIDER).then((result) => {
    console.log("Autherising");
    userDetails.displayName = result.user.displayName
    userDetails.email = result.user.email
    userDetails.photoUrl = result.user.photoURL
    userDetails.uid = result.user.uid
    fb_readRecords("adminUsers/" + userDetails.uid).then((snapshot) => {
      adminVal = (snapshot != null);
      sessionStorage.setItem("adminVal", adminVal);
      console.log(JSON.parse(sessionStorage.getItem("adminVal")));
    });
        
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
    console.log(result)
    return fb_readRecords("userDetails/" + userDetails.uid).then((snapshot) => {
    return snapshot !== null;
  })
  .catch((error) => {
    console.log("error");
  });
  })
}

///////////////////////////////////
//Name:fb_detectLoginChange()
//When: main.mjs
//Job: checks if a user is logged in
//Input: N/A
//Output:N/A
////////////////////////////////
function fb_detectLoginChange() {
  console.log('%c fb_detectLoginChange(): ', 
  'color: ' + COL_C + '; background-color: ' + COL_B + ';');
  const AUTH = getAuth();
  onAuthStateChanged(AUTH, (user) => {
    if (user) {
      console.log("User In");
    } else {
      console.log("user Out");
    }
  }, (error) => {
    console.log("error");
  });
  
}

///////////////////////////////////
//Name:fb_Logout()
//When: main.mjs
//Job: signs out account
//Input: N/A
//Output:N/A
////////////////////////////////
function fb_Logout() {
  //console.log('%c fb_Logout():', 
  //'color: ' + COL_C + '; background-color: ' + COL_B + ';');

  
  const AUTH = getAuth();
    signOut(AUTH).then(() => {
        console.log("Logged out")
        window.location.href = '../../index.html';
        sessionStorage.clear();
    })
    .catch((error) => {
      console.log("Logged out error")
    });
}

///////////////////////////////////
//Name:fb_writeRecords(pathkey, data)
//When: fb_adminCommands(); || fb_registerDetails(); || bd.mjs
//Job: writes data to location in database
//Input: (pathKey, (location in database)) (data, (data to write))
//Output: Returns when done
////////////////////////////////
function fb_writeRecords(pathKey, data) {
  console.log('%c fb_writeRecords(): ', 
  'color: ' + COL_C + '; background-color: ' + COL_B + ';');     	
  const REF = ref(getDatabase(), pathKey);
  console.log("writing: " + data + "  To " + pathKey)  
    return set(REF, data).then(() => {
    }).catch((error) => {
        console.log("error" + " :(")
    });
}

///////////////////////////////////
//Name:fb_readRecords(pathKey)
//When: fb_authenticate(); || fb_registerDetails()|; || fb_attemptLogIn(); || bd.mjs || gameSelecetion.mjs
//Job: reads data from location in database
//Input: (pathKey, (location in database))
//Output: returns data from location
////////////////////////////////

function fb_readRecords(pathKey) {
  console.log('%c fb_readRecords(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');

  const dbReference = ref(getDatabase(), pathKey);
  console.log("getting info from", pathKey);

  return get(dbReference)
    .then((snapshot) => {
      if (snapshot.val() != null) {
        return snapshot.val();
      } else {
        console.log("No data found.");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

///////////////////////////////////
//Name:fb_remove(pathKey)
//Job: removes data
//Input: (pathKey, (location in database))
////////////////////////////////

async function fb_remove(pathKey) {
  console.log('%c fb_remove(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
  const dbReference = ref(getDatabase(), pathKey);
  console.log("Removing: " + pathKey)  
    return remove(dbReference).then(() => {
    }).catch((error) => {
        console.log("error" + error)
    });
}


///////////////////////////////////
//Name:fb_sortedRead()
//When: gameSelection.mjs
//Job: To read from a location and return a sorted array
//Input: (pathKey, (location in database))
//Output: Sorted Array
////////////////////////////////
function fb_sortedRead(pathKey) {
  console.log('%c fb_sortedRead(): ', 
  'color: ' + COL_C + '; background-color: ' + COL_B + ';');

  const dbReference = query(ref(getDatabase(), pathKey), orderByValue());
  return get(dbReference).then((snapshot) => {
    const SORTED = []
    if (snapshot.exists()) {
      snapshot.forEach((_child) => {
        SORTED.push({key: _child.key, value: _child.val()})})
        return SORTED.reverse();
    } else {
    console.log("Nothing to sort");
  }
  }).catch((error) => {
    console.log(error);
  });
}

///////////////////////////////////
//Name:fb_attemptLogIn()
//When: main.mjs
//Job: To attempt to log in, if not registered go to registration page
//Input: N/A
//Output:N/A
////////////////////////////////
function fb_attemptLogIn() {
  console.log('%c fb_attemptLogIn(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');

  fb_authenticate().then((active) => {
    if (active == true){
      fb_readRecords("/userDetails/" + userDetails.uid).then((snapshot) => {
        userDetails = snapshot;
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
        window.location.href = './pages/gameSelection/gameSelection.html';
      })
    } else {
      window.location.href = './pages/registration/registration.html';
    }
  })
}

///////////////////////////////////
//Name:fb_registerDetails()
//When: registration.mjs
//Job: to write the data from the registartion page to userDetails in the database
//Input: (gameName, (userDetails.gameName)) (age, (userDetails.age)) (gender, (userDetails.gender))
//Output:N/A
////////////////////////////////
function fb_registerDetails(gameName, age, gender){
  console.log('%c fb_registerDetails(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    userDetails.gameName = gameName;
    userDetails.age = age;
    userDetails.gender = gender;
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
    fb_writeRecords("userDetails/" + userDetails.uid, userDetails).then(() => {
    window.location.href = "../../pages/gameSelection/gameSelection.html"
    })
}

///////////////////////////////////
//Name:fb_adminCommands()
//When: admin.mjs
//Job: To execute a command depending on params
//Input: (command, (The type of command)) (pathKey, (location in database)) (data, (what data to write))
//Output:N/A
////////////////////////////////
function fb_adminCommands(command, pathKey, data){
  console.log('%c fb_adminCommands(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log(command)
    if(command == "read"){
      fb_readRecords(pathKey).then((snapshot) => {
        alert(JSON.stringify(snapshot.val(), null, 2));
      })
    } else if(command == "write"){
      fb_writeRecords(pathKey, data)
      alert("Wrote " + data + " to " + pathKey)
    }
}


function fb_onValue(path, callback){
  const dbReference = ref(getDatabase(), path)
  onValue(dbReference, (snapshot) => {
    callback(snapshot.val())
  })
}


/**************************************************************/
// END OF CODE
/**************************************************************/

