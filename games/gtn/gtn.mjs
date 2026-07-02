/*******************************************************/
//gtn.mjs
//Conatains all code for The guess the number game
//the game involves taking turns to guess the numberuntil someone gets it
///writen by George Taylor 
//Term 2 2026

//////////////////////Function Comments method
//Job: What it does
/////////////////////////////////
/*******************************************************/

import { fb_readRecords, fb_writeRecords, fb_remove, userDetails, fb_onValue, fb_initialise }
    from "../../Fb_io.mjs";

window.returnToMenu = returnToMenu;
window.hostGame = hostGame;
window.addJoinListener = addJoinListener;

fb_initialise()

var lobbyDetails = {};
var feedBackLine;
var turnLine;

if (sessionStorage.getItem("lobbyDetails") != null) {
    lobbyDetails = JSON.parse(sessionStorage.getItem("lobbyDetails"));
}

///////////////////////////////////
//initilizes the lobby. sends data to db. sets lobbys data to session storage. sends user to game page
////////////////////////////////
async function hostGame() {
    const LOBBY_ID = Math.floor(Math.random() * 10000);
    if (await fb_readRecords("gameList/gtn/lobbies/" + LOBBY_ID) == null) {
        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_ID + "/users/" + userDetails.uid, userDetails.gameName);
        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_ID + "/" + LOBBY_ID + "/", "lobby");
        lobbyDetails = await fb_readRecords("gameList/gtn/lobbies/" + LOBBY_ID)
        lobbyDetails.lobbyID = LOBBY_ID;
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));
        window.location.href='./gtnLobby.html'; 
    } else {
        hostGame();
    }
}

///////////////////////////////////
//writes second half of lobbys data to db. sets lobbys data to session storage. sends user to game page
////////////////////////////////
function addJoinListener() {
    document.getElementById("joinLobby").addEventListener("submit", async (result) => {
        result.preventDefault();
        const LOBBY_CODE = result.target.lobbyCode.value;

        if (LOBBY_CODE === "" || isNaN(Number(LOBBY_CODE))) {
            alert("that is not a number");
            return;
        }

        const EXISTING = await fb_readRecords("gameList/gtn/lobbies/" + LOBBY_CODE);
        if (EXISTING == null) {
            alert("Lobby does not exist");
            return;
        }

        const HOST_UID = Object.keys(EXISTING.users)[0];
        const RANDOMUID = Math.random() < 0.5 ? HOST_UID : userDetails.uid;

        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_CODE + "/users/" + userDetails.uid, userDetails.gameName);
        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_CODE + "/feedBack", "Nothing to report yet");
        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_CODE + "/turn/", RANDOMUID);
        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_CODE + "/" + LOBBY_CODE + "/", "game");
        await fb_writeRecords("gameList/gtn/lobbies/" + LOBBY_CODE + "/num/", Math.floor(Math.random() * 101));

        lobbyDetails = await fb_readRecords("gameList/gtn/lobbies/" + LOBBY_CODE);
        lobbyDetails.lobbyID = LOBBY_CODE;
        sessionStorage.setItem("lobbyDetails", JSON.stringify(lobbyDetails));

        window.location.href = './gtnLobby.html';
    });
}
///////////////////////////////////
//removes lobby from database. removes lobbyDetails from session storage. sends user to menu
////////////////////////////////
async function returnToMenu() {
    await fb_remove("gameList/gtn/lobbies/" + lobbyDetails.lobbyID);
    sessionStorage.removeItem("lobbyDetails");
    window.location.href = './gtn.html';
}

///////////////////////////////////
//finds the users partner in the lobby and sets it to lobbyDetails.partner
////////////////////////////////
function findPartner(){
    if (Object.keys(lobbyDetails.users)[0] != userDetails.uid){
        lobbyDetails.partner = Object.keys(lobbyDetails.users)[0];
    } else {
        lobbyDetails.partner = Object.keys(lobbyDetails.users)[1];
    }
}

///////////////////////////////////
//listens for changes in the lobby and updates the page accordingly
////////////////////////////////
async function usersChange(){
    const SNAPSHOT = await fb_readRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID);
    lobbyDetails = { ...SNAPSHOT, lobbyID: Object.keys(SNAPSHOT)[0] };
    findPartner();
    document.getElementById("partnerLine").innerHTML = lobbyDetails.users[lobbyDetails.partner] + " :: " + lobbyDetails.lobbyID;

    if (Object.keys(lobbyDetails.users).length > 1){
        feedBackLine.innerHTML = "Friend has joined";
    }
    turnChange();
}

///////////////////////////////////
//listens for changes to the users list. if your partner is no longer in it, they've left the lobby, so send this user back to the gtn home page
////////////////////////////////
async function opponentLeftCheck() {
    if (!lobbyDetails.partner) return; // partner hasn't joined yet, nothing to check
    const USERS = await fb_readRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/users");
    if (USERS == null || !(lobbyDetails.partner in USERS)) {
        sessionStorage.removeItem("lobbyDetails");
        window.location.href = './gtn.html';
    }
}

///////////////////////////////////
//takes the users guess and checks if its correct. updates the database with the result and changes the turn
//Input: (result) the form submittin
////////////////////////////////
async function guessNumber(result) {
    result.preventDefault();

    if (result.target.number.value.trim() === "" || isNaN(Number(result.target.number.value.trim()))) {
        feedBackLine.innerHTML = "Please enter a number";
        return;
    }

    const NUM = Number(result.target.number.value.trim());
    if (NUM < 0 || NUM > 100) {
        feedBackLine.innerHTML = "Invalid number, must be between 0 and 100";
        return;
    }

    var score = await fb_readRecords("gameList/gtn/scores/" + userDetails.uid);
    if (score == null) {
        score = 0;
    }
    
    if (lobbyDetails[lobbyDetails.lobbyID] == "finished"){
        feedBackLine.innerHTML = "Game has finished, return to menu and start a new game";
        return;
    } else if (lobbyDetails[lobbyDetails.lobbyID] == "lobby"){
        feedBackLine.innerHTML = "You can't play by yourself.  :(  <br>  Wait for a partner to join";
        return;
    }

    if (lobbyDetails.turn == null){
        feedBackLine.innerHTML = "";
    }else if (lobbyDetails.turn != userDetails.uid){
        feedBackLine.innerHTML = "It's not your turn yet!";
        return;
    }

    if (NUM == lobbyDetails.num){
        feedBackLine.innerHTML = "You won, Congrats!!  :)" + "    (" + lobbyDetails.num + ")";
        await fb_writeRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/feedBack", "They won :(    (" + lobbyDetails.num + ")");
        await fb_writeRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/" + lobbyDetails.lobbyID, "finished");
        await fb_writeRecords("gameList/gtn/scores/" + userDetails.uid, await fb_readRecords("gameList/gtn/scores/" + userDetails.uid) + 1);
    } else if (NUM > lobbyDetails.num){
        feedBackLine.innerHTML = "Your guess was too high!";
        fb_writeRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/feedBack", "They guessed too high");
    } else {
        feedBackLine.innerHTML = "Your guess was too low!";
        fb_writeRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/feedBack", "They guessed too low");
    }

    fb_writeRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/turn", lobbyDetails.partner);
}

///////////////////////////////////
//listens for changes in the turn and feedback and updates the page 
////////////////////////////////
async function turnChange(){
    lobbyDetails.turn = await fb_readRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/turn");
    lobbyDetails.feedBack = await fb_readRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/feedBack");
    lobbyDetails[lobbyDetails.lobbyID] = await fb_readRecords("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/" + lobbyDetails.lobbyID);
        if (lobbyDetails.turn == null){
            turnLine.innerHTML = "";
        } else if (lobbyDetails.turn == userDetails.uid){
            turnLine.innerHTML = "Your turn :: " + lobbyDetails.feedBack;
        } else {
            turnLine.innerHTML =    "Not your turn";
        }
    
}

///////////////////////////////////
//listens for the page to load and then either adds the join listener or sets up the game page depending on if the user is hosting or joining
////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.href.includes("/gtnLobby")) {
        addJoinListener();
    } else {
        findPartner();
        document.getElementById("partnerLine").innerHTML = lobbyDetails.users[lobbyDetails.partner] + " :: " + lobbyDetails.lobbyID;
        document.getElementById("feedbackLine").innerHTML = "Waiting for you friend to join...";
        feedBackLine = document.getElementById("feedbackLine");
        turnLine = document.getElementById("turnLine");

        fb_onValue("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/num", usersChange);
        fb_onValue("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/turn", turnChange);
        fb_onValue("gameList/gtn/lobbies/" + lobbyDetails.lobbyID + "/users", opponentLeftCheck);
        document.getElementById("guessNum").addEventListener('submit', guessNumber);
    }
});
/*******************************************************/
//  END OF Program
/*******************************************************/