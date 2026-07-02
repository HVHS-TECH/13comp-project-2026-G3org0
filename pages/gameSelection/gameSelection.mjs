/**************************************************************/
// gameSelection.mjs
// js entry for gameSelection.html
// Written by <George Taylor>, Term 2 2026
// All functions associated with the side bar (sb_), info bar (ib_) LEADERBOARD (lb_)
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
console.log('%c gameSelection.mjs', 
    'color: blue; background-color: white;');
/**************************************************************/
// Imports
/**************************************************************/
import {fb_readRecords,fb_sortedRead, adminVal, userDetails} from '../../Fb_io.mjs';
/**************************************************************/
// Window Functions
/**************************************************************/
window.ib_loadGame  = ib_loadGame;
/**************************************************************/
// Main code
/**************************************************************/
sb_checkForAdminAddButton();
//ib_loadGame("bd");
/**************************************************************/
// Functions
/**************************************************************/
///////////////////////////////////
//Job: if a user is admin and creates a button that links to the admin pages
//Input: N/A
//Output:N/A
////////////////////////////////
async function sb_checkForAdminAddButton(){
    if(await fb_readRecords("adminUsers/" + userDetails.uid) == true){
        const ADMINBTN = document.createElement("button");
        ADMINBTN.className = "sb_button";
        ADMINBTN.textContent = "Admin";
        ADMINBTN.addEventListener("click", function() {
            window.location.href = "../admin/admin.html";
        });
    document.querySelector("side-bar").appendChild(ADMINBTN);
    }
}
///////////////////////////////////
//Job: checks if a user is logged in
//Input: N/A
//Output:N/A
////////////////////////////////
function ib_loadGame(game){
    ib_updateInfoBar(game);
    ib_lb_loadResults(game).then((leaderBoard) => {
        console.log(leaderBoard)
        ib_lb_createTable(leaderBoard)
    })
}
///////////////////////////////////
//Job: Updates Info Bar to display games details exludes leaderboard
//Input: (game, (GameInitials))
//Output:N/A
////////////////////////////////
function ib_updateInfoBar(game){
    fb_readRecords("/gameList/" + game).then((gameDetails) => {
        const TITLE = document.getElementById("ib_title")
        const MARKER = document.getElementById("ib_marker")
        const PLAYBUTTONOLD = document.getElementById("ib_playButton")
        const PLAYBUTTON = PLAYBUTTONOLD.cloneNode(true);
        TITLE.textContent = gameDetails.name;
        PLAYBUTTONOLD.parentNode.replaceChild(PLAYBUTTON, PLAYBUTTONOLD);
        if(gameDetails.ready == true){
            MARKER.textContent = "LeaderBoard"
            PLAYBUTTON.textContent = "Play"
            PLAYBUTTON.onclick = "";
            PLAYBUTTON.addEventListener('click', function() {
            window.location.href = "../../games/" + game + "/" + game + ".html" 
            });
        } else {
            MARKER.textContent = "WORK IN PROGRESS";
            PLAYBUTTON.textContent = "Work In Progress";
        }
    });
}
///////////////////////////////////
//Job: Preloads an array with the placment of the scoreboard
//Input: (game, (GameInitials))
//Output: Returns array of objects representing the scoreboard
////////////////////////////////
function ib_lb_loadResults(game) {
    return fb_sortedRead("/gameList/" + game + "/scores").then(leaderboardEntries => {
        return Promise.all(
            leaderboardEntries.map(entry => {
                if(entry.key != "(WIP)"){
                    return fb_readRecords("userDetails/" + entry.key + "/gameName").then(_name => {
                        const NAME = _name;
                        console.log(NAME);
                        entry.key = NAME;
                    });
                }
            })
        ).then(() => {
            leaderboardEntries.unshift({key: 'Name', value: "Score"});
            if(leaderboardEntries.length > 10){
                leaderboardEntries.splice(9, leaderboardEntries.length-10)
            }
            return leaderboardEntries;
        });
    });
}
///////////////////////////////////
//Job: Creates a table for scoreboard
//Input: product, (leaderBoard) (array of objects representing the scoreboard))
//Output:N/A
////////////////////////////////
function ib_lb_createTable(leaderBoard) {
  const LEADERBOARDNEW = document.createElement("table");

  for (let i = 0; i < leaderBoard.length; i++) {
    const ROW = document.createElement("tr");

    for (let j = 0; j < 1; j++) {
      const CELL = document.createElement("td");
      CELL.textContent = leaderBoard[i].key;
      ROW.appendChild(CELL);
    }

    const CELL = document.createElement("td");
    CELL.textContent = leaderBoard[i].value;
    ROW.appendChild(CELL);
    LEADERBOARDNEW.appendChild(ROW);
  }

  const LEADERBOARDEOLD = document.getElementById("leaderBoard");
  LEADERBOARDEOLD.parentNode.replaceChild(LEADERBOARDNEW, LEADERBOARDEOLD);
  LEADERBOARDNEW.setAttribute("border", "1");
  LEADERBOARDNEW.setAttribute("id", "leaderBoard");
}
/**************************************************************/
//   END OF CODE
/**************************************************************/