// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const closeBtn = document.getElementById('chatbotClose');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const messages = document.getElementById('chatbotMessages');
    
    let isOpen = false;
    
    // Toggle chatbot
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            isOpen = !isOpen;
            if (container) {
                container.classList.toggle('show', isOpen);
            }
            toggleBtn.classList.toggle('active', isOpen);
        });
    }
    
    // Close chatbot
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            isOpen = false;
            if (container) {
                container.classList.remove('show');
            }
            if (toggleBtn) {
                toggleBtn.classList.remove('active');
            }
        });
    }
    
    // Send message
    function sendMessage() {
        if (!input) return;
        const text = input.value.trim();
        if (text === '') return;
        
        addMessage(text, 'user');
        input.value = '';
        
        setTimeout(() => {
            const responses = [
                "That's a great question! Let me help you with that.",
                "I can assist you with course information and language learning tips.",
                "Would you like to know more about our Spanish or French courses?",
                "We offer flexible batches to fit your schedule. When would you like to start?",
                "All our courses come with certified trainers and internationally recognized certificates.",
                "You can book a free demo class to experience our teaching methodology.",
                "We have both weekday and weekend batches available.",
                "Our courses are designed for all levels from A1 to C1."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1000);
    }
    
    function addMessage(text, sender) {
        if (!messages) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});