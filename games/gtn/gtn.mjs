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

import { fb_readRecords, fb_writeRecords, fb_remove, userDetails, fb_onValue, fb_initialise }
    from "../../Fb_io.mjs";

window.returnToMenu = returnToMenu;
window.hostGame = hostGame;
window.addJoinListener = addJoinListener;

fb_initialise()

var lobbyDetails = {};

if (sessionStorage.getItem("lobbyDetails") != null) {
    lobbyDetails = JSON.parse(sessionStorage.getItem("lobbyDetails"));
    console.log(lobbyDetails);
}

async function hostGame() {
    fb_writeRecords("tezt", "test");
    const LOBBY_ID = Math.floor(Math.random() * 10000);
    if (await fb_readRecords("lobbies/" + LOBBY_ID) == null) {
        await fb_writeRecords("lobbies/" + LOBBY_ID + "/users/" + userDetails.uid, userDetails.gameName);
        await fb_writeRecords("lobbies/" + LOBBY_ID + "/" + LOBBY_ID + "/", "lobby");
        lobbyDetails = await fb_readRecords("lobbies/" + LOBBY_ID)
        lobbyDetails.lobbyID = LOBBY_ID;
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));
        console.log(JSON.parse(sessionStorage.getItem("lobbyDetails")));
        window.location.href='./gtnLobby.html'; 
    } else {
        hostGame();
    }
}

function addJoinListener() {
    document.getElementById("joinLobby").addEventListener("submit", async (result) => {
        result.preventDefault();

        await fb_writeRecords("lobbies/" + joinLobby.lobbyCode.value + "/users/" + userDetails.uid, userDetails.gameName);
        lobbyDetails = await fb_readRecords("lobbies/" + joinLobby.lobbyCode.value);
        lobbyDetails.lobbyID = Object.keys(lobbyDetails)[0];
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));

        window.location.href = './gtnLobby.html';
        console.log(lobbyDetails);
    });
}

async function returnToMenu() {
    await fb_remove("lobbies/"+ lobbyDetails.LOBBY_ID);
    console.log(lobbyDetails);
    sessionStorage.removeItem("lobbyDetails");
    window.location.href='./gtn.html'
}

function findPartner(){
    if (Object.keys(lobbyDetails.users)[0] != userDetails.uid){
        lobbyDetails.partner = Object.keys(lobbyDetails.users)[0];
    } else {
        lobbyDetails.partner = Object.keys(lobbyDetails.users)[1];
    }
}

if (!window.location.href.includes("/gtnLobby")) {
    addJoinListener();
} else {
    
    findPartner();
    document.getElementById("partnerLine").innerHTML = lobbyDetails.users[lobbyDetails.partner] + " :: " + lobbyDetails.lobbyID;
    console.log(lobbyDetails.partner);

    console.log(lobbyDetails.lobbyID);
    fb_onValue("lobbies/" + lobbyDetails.lobbyID, async ()=>{
        lobbyDetails.users = await fb_readRecords("lobbies/" + lobbyDetails.lobbyID + "/users");
        findPartner();
        document.getElementById("partnerLine").innerHTML = lobbyDetails.users[lobbyDetails.partner] + " :: " + lobbyDetails.lobbyID;
    
    })
}

/*******************************************************/
//  END OF Program
/*******************************************************/
