import { updateUI } from './updateUI.js';
import { updateSatsDisplay, deductSatsForSend } from './satsBalance.js';
import { scrollToBottom } from './common.js';
import { topUp } from './lightning.js';
import { clearConversation } from './conversations.js';

// Display previous conversation (if any) when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // const messagesDiv = document.getElementById('messages');
    // // messagesDiv.innerHTML = conversation.join('<br>');  // Assuming each message is separated by a line break
    scrollToBottom();
});

document.getElementById('send-button').addEventListener('click', function(event) {
    deductSatsForSend();
});

document.getElementById('top-up-button').addEventListener('click', function(event) {
    topUp();
});

document.getElementById("clear-button").addEventListener("click", function(event) {
    clearConversation();
});

document.body.addEventListener('htmx:afterSwap', function(event) {
    console.log("htmx:afterSwap event triggered");
    setTimeout(() => {
        scrollToBottom();
        console.log("Attempted to scroll to bottom");
    }, 50);
});

function checkWebLN() {
    if (window.webln) {
        console.log("WebLN is already defined");
        document.getElementById('send-button').style.display = 'inline-block';
    }
    updateSatsDisplay();
    updateUI();
}

document.addEventListener('DOMContentLoaded', checkWebLN);