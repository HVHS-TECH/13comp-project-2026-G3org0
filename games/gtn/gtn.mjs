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

import { fb_readRecords, fb_writeRecords } 
from "../../Fb_io.mjs";

var lobbyID

window.hostGame = hostGame();

document.getElementById("joinLobby").addEventListener("submit", function(result) {
    result.preventDefault();
    //if (fb_readRecords("lobbies/" + joinLobby.lobbyCode)){

    //}  
    console.log(fb_readRecords("lobbies/" + joinLobby.lobbyCode.value))
});

function hostGame(){
    lobbyID = crypto.randomUUID
    console.log(lobbyID);
}


/*******************************************************/
//  END OF Program
/*******************************************************/
