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

window.returnToMenu = returnToMenu;
window.hostGame = hostGame;
window.addJoinListener = addJoinListener;


var lobbyDetails;

if (sessionStorage.getItem("lobbyDetails") != null) {
    lobbyDetails = JSON.parse(sessionStorage.getItem("lobbyDetails"));
    console.log(lobbyDetails);
}

function addJoinListener() {
    document.getElementById("joinLobby").addEventListener("submit", async (result) => {
        result.preventDefault();
        await fb_writeRecords("lobbies/" + joinLobby.lobbyCode.value + "/users/" + userDetails.uid, "ssss userDetails.displayName");
        lobbyDetails = await fb_readRecords("lobbies/" + joinLobby.lobbyCode.value);
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));
        window.location.href = './gtnLobby.html';
        console.log(userDetails);
    });
}


async function hostGame() {
    fb_writeRecords("tezt", "test");
    var lobbyID = Math.floor(Math.random() * 10000);
    console.log(lobbyID);
    if (await fb_readRecords("lobbies/" + lobbyID) == null) {
        await fb_writeRecords("lobbies/" + lobbyID + "/users/" + userDetails.uid, userDetails.displayName);
        await fb_writeRecords("lobbies/" + lobbyID + "/hostId/" + userDetails.uid, userDetails.displayName);
        await fb_writeRecords("lobbies/" + lobbyID + "/state/", "lobby");

        sessionStorage.setItem("lobbyDetails", JSON.stringify(await fb_readRecords("lobbies/" + lobbyID)));
        console.log(JSON.parse(sessionStorage.getItem("lobbyDetails")));
        window.location.href='./gtnLobby.html'; 
    } else {
        hostGame();
    }
}

function returnToMenu() {
    console.log(lobbyDetails)
    const HOST_ID = Object.keys(lobbyDetails.hostId)[0];
    if(HOST_ID == userDetails.uid) {
        if(lobbyDetails.users)fb_writeRecords
    console.log(HOST_ID);
    //sessionStorage.lobbyDetails.clear();
    //window.location.href='./gtn.html'
}


if (!window.location.href.includes("/gtnLobby")) {
    addJoinListener();
} else {
    document.getElementById("hostLine").innerHTML = lobbyDetails.users.DLwyQGWmkUgNcczxwXGWGeIyWY62;
}

/*******************************************************/
//  END OF Program
/*******************************************************/
