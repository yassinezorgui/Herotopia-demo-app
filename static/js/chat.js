/**
 * Herotopia - Chat Module
 * Handles chatbot interactions and message management
 */

/**
 * Send message to chatbot
 */
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    // Validate message
    if (!message) {
        showToast('Please enter a message', 'warning');
        return;
    }
    
    if (appState.isLoadingResponse) {
        showToast('Please wait for the current response', 'warning');
        return;
    }
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Show loading indicator
    const chatMessages = document.getElementById('chat-messages');
    showLoadingIndicator(chatMessages);
    appState.isLoadingResponse = true;
    
    try {
        // Prepare request data
        const requestData = {
            message: message,
            language: appState.currentLanguage,
            history: appState.chatHistory.slice(-10) // Send last 10 messages for context
        };
        
        // Send message to server
        const response = await apiRequest('/chat', requestData, 'POST');
        
        // Remove loading indicator
        removeLoadingIndicator(chatMessages);
        
        if (response.success) {
            // Add bot response to chat
            addMessageToChat(response.response, 'bot');
            
            // Update chat history
            appState.chatHistory.push({
                role: 'user',
                content: message
            });
            appState.chatHistory.push({
                role: 'assistant',
                content: response.response
            });
        } else {
            showToast(`Error: ${response.error}`, 'error');
            removeLoadingIndicator(chatMessages);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showToast(`Failed to send message: ${error.message}`, 'error');
        removeLoadingIndicator(chatMessages);
    } finally {
        appState.isLoadingResponse = false;
        scrollChatToBottom();
        chatInput.focus();
    }
}

/**
 * Add message to chat display
 * @param {string} message - Message text
 * @param {string} role - Role (user or bot)
 */
function addMessageToChat(message, role) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;
    
    // Get appropriate emoji for role
    const avatar = role === 'user' ? '👤' : '🤖';
    
    // Format message content with proper text handling
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    messageParagraph.style.whiteSpace = 'pre-wrap';
    messageParagraph.style.wordWrap = 'break-word';
    
    contentDiv.appendChild(messageParagraph);
    
    // Assemble message
    messageDiv.innerHTML = `<div class="message-avatar">${avatar}</div>`;
    messageDiv.appendChild(contentDiv);
    
    // Add to chat
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollChatToBottom();
}

/**
 * Clear chat history
 */
function clearChatHistory() {
    if (!confirm('Are you sure you want to clear the chat history?')) {
        return;
    }
    
    appState.chatHistory = [];
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = `
        <div class="chat-message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>Hello! I'm your educational assistant. Ask me anything about your studies!</p>
            </div>
        </div>
    `;
    
    showToast('Chat history cleared', 'info');
}

/**
 * Export chat as text
 */
function exportChatAsText() {
    if (appState.chatHistory.length === 0) {
        showToast('No messages to export', 'warning');
        return;
    }
    
    let exportText = 'Herotopia Chat History\n';
    exportText += `Language: ${appState.currentLanguage}\n`;
    exportText += `Date: ${new Date().toLocaleString()}\n`;
    exportText += '='.repeat(50) + '\n\n';
    
    appState.chatHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'You' : 'Assistant';
        exportText += `${role}:\n${msg.content}\n\n`;
    });
    
    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportText));
    element.setAttribute('download', `herotopia-chat-${Date.now()}.txt`);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showToast('Chat exported successfully', 'success');
}

/**
 * Get suggested questions based on language
 * @returns {Array} Array of suggested questions
 */
function getSuggestedQuestions() {
    const suggestions = {
        'en': [
            'What is photosynthesis?',
            'Explain the water cycle',
            'How do plants grow?',
            'What are cells?',
            'Tell me about gravity'
        ],
        'ar': [
            'ما هو البناء الضوئي؟',
            'اشرح دورة الماء',
            'كيف تنمو النباتات؟',
            'ما هي الخلايا؟',
            'حدثني عن الجاذبية'
        ],
        'fr': [
            'Qu\'est-ce que la photosynthèse?',
            'Expliquez le cycle de l\'eau',
            'Comment les plantes poussent-elles?',
            'Qu\'est-ce que les cellules?',
            'Parlez-moi de la gravité'
        ]
    };
    
    return suggestions[appState.currentLanguage] || suggestions['en'];
}

/**
 * Insert suggested question into chat
 * @param {string} question - Question text
 */
function insertSuggestedQuestion(question) {
    const chatInput = document.getElementById('chat-input');
    chatInput.value = question;
    chatInput.focus();
}

/**
 * Initialize chat keyboard shortcuts
 */
function initializeChatShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K to focus chat input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('chat-input')?.focus();
        }
        
        // Escape to unfocus chat input
        if (e.key === 'Escape') {
            document.getElementById('chat-input')?.blur();
        }
    });
}

// Initialize chat shortcuts on load
document.addEventListener('DOMContentLoaded', initializeChatShortcuts);
