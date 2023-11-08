import { getSatsFromStorage } from './satsBalance.js';
import { SATS_PER_SEND } from './constants.js';

export function updateUI() {
    const currentSats = getSatsFromStorage();
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const topUpButton = document.getElementById('top-up-button');

    console.log("currentSats in updateUI", currentSats)
    if (currentSats < SATS_PER_SEND) {
        chatInput.style.display = 'none';
        sendButton.style.display = 'none';
        topUpButton.style.display = 'inline-block';
        chatInput.removeAttribute('required');
    } else {
        chatInput.style.display = 'inline-block';
        sendButton.style.display = 'inline-block';
        topUpButton.style.display = 'none';
        chatInput.setAttribute('required', true);
    }
}