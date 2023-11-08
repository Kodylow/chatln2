import { SATS_PER_SEND } from './constants.js'
import { toastError } from './common.js'
import { updateUI } from './updateUI.js';
export function getSatsFromStorage() {
    return localStorage.getItem('sats') ? parseInt(localStorage.getItem('sats')) : 0;
}

export function setSatsInStorage(amount) {
    localStorage.setItem('sats', amount);
}

export function updateSatsDisplay() {
    const satsDisplay = document.getElementById('sats-display');
    satsDisplay.innerText = `${getSatsFromStorage()} sats`;
}

export function deductSatsForSend() {
    const currentSats = getSatsFromStorage();
    console.log("currentSats in deduct", currentSats)
    if (currentSats >= SATS_PER_SEND) {
        setSatsInStorage(currentSats - SATS_PER_SEND);
    } else {
        toastError('Insufficient sats! Please top up.');
    }
    updateUI();
}