/**************************************************************/
// admin.mjs
// js entry for admin.html
// Written by <George Taylor>, Term 2 2026
/**************************************************************/
/*******************************************************/
//////////////////////Function Comments method
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
///////////////////////////////////
//Job: handdles and verfys the submission of a admin command
//Input: (result) the form submittin
//Output: Returns array of objects representing the scoreboard
////////////////////////////////
document.getElementById("adminCommand").addEventListener("submit", function(result) {
    result.preventDefault();
    
    if (result.target.location.value == "") {
        alert("Invalid Location");
        return;}

    if (result.target.command.value == "") {
        alert("Invalid Command");
        return;}
        
    if (result.target.command.value == "write") {
        if (result.target.data.value == "") {
            alert("Invalid Data");
            return;
        }

        var data;
        if (isNaN(Number(result.target.data.value))){
            data = result.target.data.value;
        } else {
            data = Number(result.target.data.value);
        }
        fb_adminCommands(result.target.command.value, result.target.location.value, data);
    }

    if (result.target.command.value == "read") {
        fb_adminCommands(result.target.command.value, result.target.location.value);
    }
})
/**************************************************************/
//   END OF CODE
/**************************************************************/
