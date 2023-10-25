import { SATS_PER_SEND } from './constants.js'

export function getSatsFromStorage() {
    return localStorage.getItem('sats') ? parseInt(localStorage.getItem('sats')) : 0;
}

export function setSatsInStorage(amount) {
    localStorage.setItem('sats', amount);
    updateSatsDisplay();
}

export function updateSatsDisplay() {
    const satsDisplay = document.getElementById('sats-display');
    satsDisplay.innerText = `${getSatsFromStorage()} sats`;
}

export function deductSatsForSend() {
    const currentSats = getSatsFromStorage();
    if (currentSats >= SATS_PER_SEND) {
        setSatsInStorage(currentSats - SATS_PER_SEND);
    } else {
        toastError('Insufficient sats! Please top up.');
    }
}