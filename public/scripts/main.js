import { updateUI } from './updateUI.js';
import { deductSatsForSend } from './satsBalance.js';
import { scrollToBottom } from './common.js';
import { topUp } from './lightning.js';
import { clearConversation, loadConversation, saveConversation } from './conversations.js';

function updateEmptyMessage() {
    const messagesDiv = document.getElementById('messages');
    const emptyMessageDiv = document.getElementById('empty-message');
    if (messagesDiv.children.length === 0) {
        emptyMessageDiv.style.display = 'block';
    } else {
        emptyMessageDiv.style.display = 'none';
    }
}

// Display previous conversation (if any) when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateEmptyMessage();
    scrollToBottom();

});

document.getElementById('send-button').addEventListener('click', function(event) {
    const clear = document.getElementById('clear-button');
    clear.style.display = 'block';
    deductSatsForSend();
});

document.getElementById('top-up-button').addEventListener('click', function(event) {
    topUp();
});

document.getElementById("clear-button").addEventListener("click", function(event) {
    const clear = document.getElementById('clear-button');
    clear.style.display = 'none';
    clearConversation();
});

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

let targetNode = document.getElementById('messages');

let config = { attributes: true, childList: true, subtree: true };

let saveDebounced = debounce(saveConversation, 1000);  // waits for 1 second pause
let scrollDebounced = debounce(scrollToBottom, 50);

let callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            saveDebounced();
            scrollDebounced();
            updateEmptyMessage();
            break;
        }
    }
};

let observer = new MutationObserver(callback);

observer.observe(targetNode, config);


// document.getElementById('drawer-toggle').addEventListener('click', function() {
//     const drawer = document.getElementById('drawer');
//     if (drawer.classList.contains('-translate-x-full')) {
//         drawer.classList.remove('-translate-x-full');
//         drawer.classList.add('translate-x-0');
//     } else {
//         drawer.classList.remove('translate-x-0');
//         drawer.classList.add('-translate-x-full');
//     }
// });

function checkWebLN() {
    if (window.webln) {
        console.log("WebLN is already defined");
        document.getElementById('send-button').style.display = 'inline-block';
    }

    loadConversation();
    updateUI();
}

document.addEventListener('DOMContentLoaded', checkWebLN);