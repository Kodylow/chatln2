// Function to clear the conversation from both the display and localStorage
export function clearConversation() {
    // Clear the messages from the display
    document.getElementById('messages').innerHTML = '';

    // Clear the conversation from the local storage
    localStorage.removeItem('conversationHistory');

    // Reset the conversation array
    conversation.length = 0;
}
