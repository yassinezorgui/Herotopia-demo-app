/**
 * Herotopia - Utility Functions
 * Common utilities used across the application
 */

// Global state
const appState = {
    currentLanguage: localStorage.getItem('language') || 'en',
    currentSection: 'chatbot',
    chatHistory: [],
    isLoadingResponse: false
};

// Language labels
const languageNames = {
    'en': 'English',
    'ar': 'العربية',
    'fr': 'Français'
};

const languageFlags = {
    'en': '🇬🇧',
    'ar': '🇸🇦',
    'fr': '🇫🇷'
};

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Herotopia...');
    
    // Set initial language
    setLanguage(appState.currentLanguage, false);
    
    // Show chatbot section by default
    showChatbot();
    
    // Initialize event listeners
    initializeEventListeners();
    
    console.log('✓ Herotopia initialized');
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Chat input listeners
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    if (chatInput && sendButton) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Library search
    const librarySearch = document.getElementById('library-search');
    if (librarySearch) {
        librarySearch.addEventListener('input', (e) => {
            filterLibraryItems(e.target.value);
        });
    }
}

/**
 * Set application language
 * @param {string} langCode - Language code (en, ar, fr)
 * @param {boolean} reload - Whether to reload data
 */
function setLanguage(langCode, reload = true) {
    if (!['en', 'ar', 'fr'].includes(langCode)) {
        console.warn(`Invalid language code: ${langCode}`);
        return;
    }
    
    appState.currentLanguage = langCode;
    localStorage.setItem('language', langCode);
    
    // Update UI
    updateLanguageUI();
    
    // Set document language attribute
    document.documentElement.lang = langCode;
    
    // Set text direction for Arabic
    if (langCode === 'ar') {
        document.documentElement.dir = 'rtl';
        document.body.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
        document.body.dir = 'ltr';
    }
    
    console.log(`Language changed to: ${languageNames[langCode]}`);
}

/**
 * Update language selector UI
 */
function updateLanguageUI() {
    const currentLangElement = document.getElementById('current-language');
    const chatLangElement = document.getElementById('chat-language');
    
    if (currentLangElement) {
        currentLangElement.textContent = languageNames[appState.currentLanguage];
    }
    
    if (chatLangElement) {
        chatLangElement.textContent = languageNames[appState.currentLanguage];
    }
}

/**
 * Show chatbot section
 */
function showChatbot() {
    document.getElementById('chatbot-section').style.display = 'flex';
    document.getElementById('library-section').style.display = 'none';
    document.getElementById('about-section').style.display = 'none';
    appState.currentSection = 'chatbot';
}

/**
 * Show library section
 */
function showLibrary() {
    document.getElementById('chatbot-section').style.display = 'none';
    document.getElementById('library-section').style.display = 'flex';
    document.getElementById('about-section').style.display = 'none';
    appState.currentSection = 'library';
    
    // Load library on first view
    loadLibrary();
}

/**
 * Show about section
 */
function showAbout() {
    document.getElementById('chatbot-section').style.display = 'none';
    document.getElementById('library-section').style.display = 'none';
    document.getElementById('about-section').style.display = 'flex';
    appState.currentSection = 'about';
}

/**
 * Format timestamp for chat messages
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Show loading indicator
 * @param {HTMLElement} container - Container to show loading in
 */
function showLoadingIndicator(container) {
    const loadingHTML = `
        <div class="chat-message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', loadingHTML);
    container.scrollTop = container.scrollHeight;
}

/**
 * Remove loading indicator
 * @param {HTMLElement} container - Container to remove loading from
 */
function removeLoadingIndicator(container) {
    const loadingMessages = container.querySelectorAll('.typing-indicator');
    loadingMessages.forEach(msg => {
        msg.closest('.chat-message').remove();
    });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastId = `toast-${Date.now()}`;
    const bgClass = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    }[type] || 'bg-info';
    
    const toastHTML = `
        <div id="${toastId}" class="toast position-fixed top-0 end-0 m-3" role="alert">
            <div class="toast-body ${bgClass} text-white">
                ${message}
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    
    setTimeout(() => {
        toastElement.remove();
    }, duration);
}

/**
 * Scroll chat to bottom
 */
function scrollChatToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @param {string} method - HTTP method
 * @returns {Promise} API response
 */
async function apiRequest(endpoint, data = null, method = 'POST') {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`API request failed: ${error}`);
        throw error;
    }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
