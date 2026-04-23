/**************************************************************/
// main.mjs
// Main entry for all html files
// Written by <George Taylor>, Term 2 2025
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
console.log('%c main.mjs', 
    'color: blue; background-color: white;');
/**************************************************************/
// Imports
/**************************************************************/
import {
    fb_attemptLogIn,
    fb_authenticate, fb_detectLoginChange,
    fb_initialise, fb_Logout, fb_writeRecords, userDetails
} from '../../Fb_io.mjs';
/**************************************************************/
// Window Functions
/**************************************************************/
    window.fb_initialise  = fb_initialise;
    window.fb_authenticate  = fb_authenticate;
    window.fb_detectLoginChange  = fb_detectLoginChange;
    window.fb_Logout  = fb_Logout;
    window.fb_attemptLogIn  = fb_attemptLogIn;
/**************************************************************/
// Main code
/**************************************************************/
if (document.getElementById("sb_title") != null) {
    const TITLE = document.getElementById("sb_title")
    TITLE.textContent = userDetails.gameName;
}

fb_initialise();
fb_detectLoginChange();
/**************************************************************/
//   END OF CODE
/**************************************************************/