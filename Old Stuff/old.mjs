import { userDetails } from '../Fb_io.mjs';
import {
fb_authenticate,
fb_initialise,
fb_readRecords,
fb_writeRecords
} from '/Fb_io.mjs';



var messageSpace = document.getElementById("welcomeMessage");
var textInput = document.getElementById("textInput");

var changeHeaderBtn = document.getElementById("headerChangeBtn");
var sendMessageBtn = document.getElementById("sendMessageBtn");
var readMessageBtn = document.getElementById("readMessageBtn");

messageSpace.innerHTML = "You've connected to the JavaScript!";

changeHeaderBtn.addEventListener("click", () => {
    changeHeading();
});

sendMessageBtn.addEventListener("click", () => {
    sendMessage();
});

readMessageBtn.addEventListener("click", () => {
    readMessage();
});

function changeHeading(){
    messageSpace.innerHTML = textInput.value;
}

function sendMessage(){
    fb_writeRecords("messages/" + userDetails.uid, textInput.value);
}

async function readMessage(){
    messageSpace.innerHTML = await fb_readRecords("messages/" + userDetails.uid);
}


fb_initialise();

fb_authenticate();