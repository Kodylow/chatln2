import { getSatsFromStorage } from './satsBalance.js';

export function updateUI() {
    const currentSats = getSatsFromStorage();
    const chatInput = document.getElementById('chat-input');
    const clearButton = document.getElementById('clear-button');
    const sendButton = document.getElementById('send-button');
    const topUpButton = document.getElementById('top-up-button');


    if (currentSats === 0) {
        chatInput.style.display = 'none';
        sendButton.style.display = 'none';
        topUpButton.style.display = 'inline-block';
        clearButton.style.display = 'none';
        chatInput.removeAttribute('required');
    } else {
        chatInput.style.display = 'inline-block';
        sendButton.style.display = 'inline-block';
        topUpButton.style.display = 'none';
        clearButton.style.display = 'inline-block';
        chatInput.setAttribute('required', true);
    }
}