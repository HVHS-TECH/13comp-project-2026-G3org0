/**************************************************************/
// registration.mjs
// js entry for registration.html
// Written by <George Taylor>, Term 2 2026
/**************************************************************/
/*******************************************************/
const COL_C = 'white';
const COL_B = '#CD7F32';
console.log('%c registration.mjs', 
    'color: blue; background-color: white;');
window.logout = logout;
/**************************************************************/
// Imports
/**************************************************************/
import {fb_registerDetails, fb_Logout} from '../../Fb_io.mjs';
/**************************************************************/
// Main code
/**************************************************************/
///if form submitted, attempt to validation
function logout(){
    fb_Logout();
}

document.getElementById("regForm").addEventListener("submit", (result) => {
    result.preventDefault();

    const GAMENAME = result.target.gameName.value;
    const AGE = result.target.age.value;
    const GENDER = result.target.gender.value;

    ///////////////verfying input//////////////
    var isFormValid = true;
    if (GAMENAME == ""){
        isFormValid = false;
        alert("Game Name cannot be empty");
    }   else if (!(GAMENAME.length >= 3 && GAMENAME.length <= 15)) {
        isFormValid = false;
        alert("Game Name must be between 3 and 15 characters");
    }

    if (AGE == "") {
        isFormValid = false;
        alert("Age cannot be empty");
    } else if (isNaN(Number(result.target.age.value))) {
        alert("Please enter a number");
        return;
    } else if (!(AGE >= 12 && AGE <= 100)){
        isFormValid = false;
        alert("Age needs to be between 12 and 100 (inclusive)");
    }
    
    if (GENDER == "") {
        isFormValid = false;
        alert("must select a gender");
    }

    if(isFormValid){
        alert("registed")
        fb_registerDetails(GAMENAME, Number(AGE), GENDER);
    } 
});/**************************************************************/
//   END OF CODE
/**************************************************************/
