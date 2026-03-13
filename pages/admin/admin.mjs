/**************************************************************/
// admin.mjs
// js entry for admin.html
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
console.log('%c admin.mjs',
    'color: blue; background-color: white;');
/**************************************************************/
// Imports 
/**************************************************************/
import {fb_adminCommands,} from '../../Fb_io.mjs';
/**************************************************************/
// Main code
/**************************************************************/
document.getElementById("adminCommand").addEventListener("submit", function(result) {
    result.preventDefault();
    if(result.target.command.value != ""){
        if(result.target.location.value != ""){
            if(result.target.data.value == "" && result.target.command.value == "write"){
                alert("Invalid Data")
            } else {
                if (Number(result.target.data.value) != NaN){
                    fb_adminCommands(result.target.command.value, result.target.location.value, Number(result.target.data.value));
                } else {
                    fb_adminCommands(result.target.command.value, result.target.location.value, result.target.data.value);
                }
            }
        } else {
            alert("Invalid Location")
        }
    } else {
        alert("Invalid Command")
    }
});
/**************************************************************/
//   END OF CODE
/**************************************************************/
