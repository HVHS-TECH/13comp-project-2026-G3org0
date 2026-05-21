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
    document.getElementById("joinLobby").addEventListener("submit", async (result) => {
        result.preventDefault();
        await fb_writeRecords("lobbies/" + joinLobby.lobbyCode.value + "/users/" + userDetails.uid, "ssss userDetails.displayName");
        lobbyDetails = await fb_readRecords("lobbies/" + joinLobby.lobbyCode.value);
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));
        window.location.href='./gtnLobby.html';
        console.log(userDetails);
    });
}


async function hostGame(){
    fb_writeRecords("tezt", "test");
    var lobbyID = Math.floor(Math.random() * 10000);
    console.log(lobbyID);
    if (await fb_readRecords("lobbies/" + lobbyID) == null){
        await fb_writeRecords("lobbies/" + lobbyID + "/users/" + userDetails.uid, userDetails.displayName);
        await fb_writeRecords("lobbies/" + lobbyID + "/hostId/" + userDetails.uid, userDetails.displayName);
        await fb_writeRecords("lobbies/" + lobbyID + "/state/" , "lobby");

         sessionStorage.setItem("lobbyDetails", JSON.stringify(fb_readRecords("lobbies/" + lobbyID)));    
         window.location.href='./gtnLobby.html'; 
    } else {
        hostGame();
    }
}

function returnToMenu(){
    sessionStorage.clear("lobbyDetails");
    window.location.href='./gtn.html'
}


if (!window.location.href.includes("/gtnLobby")){
    addJoinListener();
} else {
    document.getElementById("hostLine").innerHTML = lobbyDetails.users.DLwyQGWmkUgNcczxwXGWGeIyWY62;
}

window.hostGame = hostGame;
window.returnToMenu = returnToMenu;
window.addJoinListener = addJoinListener;
/*******************************************************/
//  END OF Program
/*******************************************************/
