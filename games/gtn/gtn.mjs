/*******************************************************/
//gtn.mjs
//Conatains all code for The guess the number game
//the game involves taking turns to guess the numberuntil someone gets it
///writen by George Taylor 
//Term 1 2025

//////////////////////Function Comments method
//Name: Name of the function
//When: (if called by function, name function)
//		(if called in class, name class and methods)
// 		(if called through draw loop, tree to find the code) EG.
//			draw() {	(gameState == "play"){	\\	in the draw loop 	if gameState = "play"  Run this function
//Job: What it does
//Input: input parameters
//Output: what it returns
/////////////////////////////////
/*******************************************************/

import { fb_readRecords, fb_writeRecords, userDetails } 
from "../../Fb_io.mjs";


var lobbyDetails;

if (sessionStorage.getItem("lobbyDetails") != null) {
  lobbyDetails = JSON.parse(sessionStorage.getItem("lobbyDetails"));
  console.log(lobbyDetails); 
}

function addJoinListener(){
    document.getElementById("joinLobby").addEventListener("submit", function(result) {
        result.preventDefault();
        
        console.log(fb_readRecords("lobbies/" + joinLobby.lobbyCode.value))
    });
}


async function hostGame(){
    var lobbyID = Math.floor(Math.random() * 10000);
    console.log(lobbyID);
    //if (fb_readRecords("lobbies/" + lobbyID) != null){
        fb_writeRecords("lobbies/" + lobbyID + "/users/" + userDetails.uid, true);
        fb_writeRecords("lobbies/" + lobbyID + "/state/" , "lobby");

        sessionStorage.setItem("lobbyDetails", JSON.stringify(fb_readRecords("lobbies/" + lobbyID)));    
        window.location.href='./gtnLobby.html'; 
    //} else {
    //    hostGame();
    //}
}

function returnToMenu(){
    sessionStorage.clear("lobbyDetails");
    window.location.href='./gtn.html'
}

function blah(){
    fb_writeRecords("a", "test");
}



if (window.href == "games/gtn/gtn.html"){
    addJoinListener();
}

window.hostGame = hostGame;
window.returnToMenu = returnToMenu;
window.addJoinListener = addJoinListener;
window.blah = blah;

/*******************************************************/
//  END OF Program
/*******************************************************/
