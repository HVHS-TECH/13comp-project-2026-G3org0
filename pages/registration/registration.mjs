/**************************************************************/
// registration.mjs
// js entry for registration.html
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
console.log('%c registration.mjs', 
    'color: blue; background-color: white;');
/**************************************************************/
// Imports
/**************************************************************/
import {fb_registerDetails} from '../../Fb_io.mjs';
/**************************************************************/
// Main code
/**************************************************************/
///if form submitted, attempt to validation

document.getElementById("regForm").addEventListener("submit", (result) => {
    result.preventDefault();
    onsubmit="return false;" 
    const GAMENAME = result.target.gameName.value;
    const AGE = result.target.age.value;
    const GENDER = result.target.gender.value;
        
    ///////////////verfying input//////////////
    var isFormValid = true;
    if (GAMENAME != ""){} else {
        isFormValid = false;
        alert("Invalid Game Name");
    }
    if (AGE > 12 && AGE < 100){} else {
        isFormValid = false;
        alert("Invalid age");
    }
    if (GENDER != ""){} else {
        isFormValid = false;
        alert("Invalid gender");
    }
    if(isFormValid){
        alert("registed")
        fb_registerDetails(GAMENAME, AGE, GENDER);
    } 
});
/**************************************************************/
//   END OF CODE
/**************************************************************/
