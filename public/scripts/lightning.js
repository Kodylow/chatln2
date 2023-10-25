import { setSatsInStorage, getSatsFromStorage } from './satsBalance.js';
import { toastError } from './common.js';
import { CALLBACK, SATS_PER_TOP_UP } from './constants.js';
import { updateUI } from './updateUI.js'
export async function getLightningInvoice(amount) {
    try {
        const data = await fetch(`${CALLBACK}?amount=${amount * 1000}`);
        console.log("data", data);
        const json = await data.json();
        return json.pr;
    } catch (error) {
        console.log("Error fetching lightning invoice:", error);
    }
}

export async function topUp() {
    try {
        const commonBtn = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md';
        const paymentRequest = await getLightningInvoice(SATS_PER_TOP_UP);
        await window.webln.enable();
        const { preimage } = await window.webln.sendPayment(paymentRequest);
        if (!!preimage) {
            setSatsInStorage(getSatsFromStorage() + SATS_PER_TOP_UP);
            updateUI();
            const sendButton = document.getElementById('send-button');
            sendButton.removeAttribute('disabled');
            sendButton.innerText = 'Send';
            sendButton.className = commonBtn + ' bg-blue-500 hover:bg-blue-700';
        } else {
            toastError('Invoice wasn\'t paid!');
        }
    } catch (error) {
        toastError('Error processing payment!');
    }
}
