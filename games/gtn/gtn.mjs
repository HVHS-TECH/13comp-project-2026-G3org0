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

import { fb_readRecords, fb_writeRecords, fb_remove, userDetails }
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

        await fb_writeRecords("lobbies/" + joinLobby.lobbyCode.value + "/users/" + userDetails.uid, userDetails.gameName);
        lobbyDetails = await fb_readRecords("lobbies/" + joinLobby.lobbyCode.value);
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));

        console.log(lobbyDetails.users);
        if (Object.keys(lobbyDetails.users)[0] != userDetails.uid){
            lobbyDetails.partner = Object.keys(lobbyDetails.users)[0];
        } else {
            lobbyDetails.partner = Object.keys(lobbyDetails.users)[1];
        }
        console.log(lobbyDetails);
        
        
        window.location.href = './gtnLobby.html';
        console.log(userDetails);
    });
}


async function hostGame() {
    fb_writeRecords("tezt", "test");
    var lobbyID = Math.floor(Math.random() * 10000);
    console.log(lobbyID);
    if (await fb_readRecords("lobbies/" + lobbyID) == null) {
        await fb_writeRecords("lobbies/" + lobbyID + "/users/" + userDetails.uid, userDetails.gameName);
        await fb_writeRecords("lobbies/" + lobbyID + "/" + lobbyID + "/", "lobby");
        sessionStorage.setItem("lobbyDetails", JSON.stringify(await fb_readRecords("lobbies/" + lobbyID)));
        console.log(JSON.parse(sessionStorage.getItem("lobbyDetails")));
        window.location.href='./gtnLobby.html'; 
    } else {
        hostGame();
    }
}

async function returnToMenu() {
    const LOBBY_ID = Object.keys(lobbyDetails)[0];
    await fb_remove("lobbies/"+ LOBBY_ID);
    console.log(lobbyDetails);
    sessionStorage.removeItem("lobbyDetails");
    window.location.href='./gtn.html'
}


if (!window.location.href.includes("/gtnLobby")) {
    addJoinListener();
} else {
    
    document.getElementById("partnerLine").innerHTML = lobbyDetails.partner;
}

/*******************************************************/
//  END OF Program
/*******************************************************/
