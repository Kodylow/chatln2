export function toastError(message) {
    alert(message);
}

export function scrollToBottom() {
    const messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
}