/**************************************************************/
// gameSelection.mjs
// js entry for gameSelection.html
// Written by <George Taylor>, Term 2 2025
// All functions associated with the side bar (sb_), info bar (ib_) leaderBoard (lb_)
/**************************************************************/
/*******************************************************/
//////////////////////Function Comments method
//Name: Name of the function
//When: (if called by function, name function) (If called by function in main, main) (If called by html, html file)
//Job: What it does
//Input: input parameters
//Output: what it returns
/////////////////////////////////
/*******************************************************/

const COL_C = 'white';
const COL_B = '#CD7F32';
console.log('%c gameSelection.mjs', 
    'color: blue; background-color: white;');
/**************************************************************/
// Imports
/**************************************************************/
import {fb_readRecords,fb_sortedRead, adminVal} from '../../Fb_io.mjs';
/**************************************************************/
// Window Functions
/**************************************************************/
//window.ib_loadGame  = ib_loadGame;
/**************************************************************/
// Main code
/**************************************************************/
sb_checkForAdminAddButton();
//ib_loadGame("bd");
/**************************************************************/
// Functions
/**************************************************************/
///////////////////////////////////
//Name:sb_checkForAdminAddButton()
//When: main
//Job: if a user is admin and creates a button that links to the admin pages
//Input: N/A
//Output:N/A
////////////////////////////////
function sb_checkForAdminAddButton(){
    if(adminVal){
        const adminButton = document.createElement("button");
        adminButton.className = "sb_button";
        adminButton.textContent = "Admin";
        adminButton.addEventListener("click", function() {
            window.location.href = "../admin/admin.html";
        });
    document.querySelector("side-bar").appendChild(adminButton);
    }
}
/**************************************************************/
//   END OF CODE
/**************************************************************/
