// Function to clear the conversation from both the display and localStorage
export function clearConversation() {
    // Clear the messages from the display
    document.getElementById('messages').innerHTML = '';

    // Clear the conversation from the local storage
    localStorage.removeItem('conversationHistory');

    // Reset the conversation array
    conversation.length = 0;
}

// Function to save conversation to local storage
export function saveConversation() {
    console.log("Saving conversation to local storage");
    // Get the current conversation from the display
    const messages = document.getElementById('messages');
    const conversationHistory = messages.innerHTML;
    // Save the conversation to local storage
    localStorage.setItem('conversationHistory', conversationHistory);
}

// Function to display conversation from local storage
export function loadConversation() {
    console.log("Loading conversation from local storage");
    // Check if there is a conversation in local storage
    if (localStorage.getItem('conversationHistory')) {
        console.log("Conversation found in local storage");
        const clear = document.getElementById('clear-button');
        clear.style.display = 'block';
        // Get the conversation from local storage
        const conversationHistory = localStorage.getItem('conversationHistory');
        // Display the conversation in the display
        document.getElementById('messages').innerHTML = conversationHistory;
    }
}
