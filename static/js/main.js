/**
 * Herotopia - Main Application Logic
 * Central module coordination and initialization
 */

// Prevent default behaviors
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

// Add Bootstrap library CSS if not already loaded
function ensureBootstrapLoaded() {
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
        console.warn('Bootstrap not loaded');
        return false;
    }
    return true;
}

// Initialize on page load
window.addEventListener('load', () => {
    console.log('Page fully loaded');
    
    // Ensure Bootstrap is available
    if (!ensureBootstrapLoaded()) {
        console.error('Failed to load Bootstrap');
    }
    
    // Set up navigation
    setupNavigation();
    
    // Pre-load library structure (but don't display until user clicks)
    // This improves perceived performance
    setupLibraryPreload();
    
    console.log('✓ Main application initialized');
});

/**
 * Set up navigation handlers
 */
function setupNavigation() {
    // Chatbot navigation
    const chatbotLink = document.querySelector('a[href="#chatbot-section"]');
    if (chatbotLink) {
        chatbotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showChatbot();
        });
    }
    
    // Library navigation
    const libraryLink = document.querySelector('a[href="#library-section"]');
    if (libraryLink) {
        libraryLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLibrary();
        });
    }
    
    // About navigation
    const aboutLink = document.querySelector('a[href="#about-section"]');
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAbout();
        });
    }
}

/**
 * Pre-load library structure
 */
function setupLibraryPreload() {
    // Pre-load library data in the background
    apiRequest('/library', null, 'GET')
        .then(response => {
            if (response.success) {
                libraryData = response.items;
                console.log('✓ Library pre-loaded');
            }
        })
        .catch(error => {
            console.warn('Library pre-load failed:', error);
        });
}

/**
 * Handle application errors globally
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred', 'error');
});

/**
 * Check for browser support
 */
function checkBrowserSupport() {
    const requiredFeatures = {
        'Fetch API': 'fetch' in window,
        'LocalStorage': 'localStorage' in window,
        'Promise': 'Promise' in window,
        'Arrow Functions': true // ES6 feature check
    };
    
    const unsupported = Object.entries(requiredFeatures)
        .filter(([_, supported]) => !supported)
        .map(([feature, _]) => feature);
    
    if (unsupported.length > 0) {
        console.warn('Missing browser features:', unsupported);
        showToast(
            `Your browser may not support: ${unsupported.join(', ')}`,
            'warning',
            5000
        );
    }
}

// Check browser support on load
document.addEventListener('DOMContentLoaded', checkBrowserSupport);

/**
 * Handle offline/online status
 */
window.addEventListener('offline', () => {
    showToast('⚠️ You are offline. The app works offline, but cannot sync.', 'warning');
});

window.addEventListener('online', () => {
    showToast('✓ You are back online', 'success');
});

/**
 * Keyboard shortcuts help
 */
function showKeyboardShortcuts() {
    const shortcuts = `
    Keyboard Shortcuts:
    - Ctrl+K / Cmd+K: Focus chat input
    - Escape: Unfocus chat input
    - Enter: Send message
    - Shift+Enter: New line in message
    `;
    
    console.log(shortcuts);
    showToast('Press Ctrl+Shift+? to see shortcuts', 'info');
}

// Register Ctrl+Shift+?
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '?') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
});

/**
 * Auto-save chat history periodically
 */
function setupAutoSave() {
    setInterval(() => {
        if (appState.chatHistory.length > 0) {
            try {
                localStorage.setItem(
                    'herotopia_chat_history',
                    JSON.stringify(appState.chatHistory)
                );
                localStorage.setItem(
                    'herotopia_last_language',
                    appState.currentLanguage
                );
                console.log('✓ Chat history auto-saved');
            } catch (error) {
                console.warn('Failed to save chat history:', error);
            }
        }
    }, 30000); // Save every 30 seconds
}

/**
 * Restore chat history from localStorage
 */
function restoreChatHistory() {
    try {
        const savedHistory = localStorage.getItem('herotopia_chat_history');
        const savedLanguage = localStorage.getItem('herotopia_last_language');
        
        if (savedHistory) {
            appState.chatHistory = JSON.parse(savedHistory);
            console.log(`✓ Restored ${appState.chatHistory.length} messages`);
            
            // Restore chat display
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = '';
            
            appState.chatHistory.forEach(msg => {
                addMessageToChat(msg.content, msg.role);
            });
        }
        
        if (savedLanguage) {
            appState.currentLanguage = savedLanguage;
        }
    } catch (error) {
        console.warn('Failed to restore chat history:', error);
    }
}

// Set up auto-save and restore on load
document.addEventListener('DOMContentLoaded', () => {
    setupAutoSave();
    restoreChatHistory();
});

/**
 * Theme preference helper
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.style.colorScheme = 'dark';
        localStorage.setItem('herotopia_theme', 'dark');
    } else {
        document.documentElement.style.colorScheme = 'light';
        localStorage.setItem('herotopia_theme', 'light');
    }
}

/**
 * Detect system theme preference
 */
function detectSystemTheme() {
    const savedTheme = localStorage.getItem('herotopia_theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
}

// Detect theme on load
document.addEventListener('DOMContentLoaded', detectSystemTheme);

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('herotopia_theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Version information
 */
const APP_VERSION = '1.0.0';
const APP_NAME = 'Herotopia';

console.log(`%c${APP_NAME} v${APP_VERSION}`, 'color: #0d6efd; font-size: 16px; font-weight: bold;');
console.log('%cEducational Chatbot & Digital Library', 'color: #666; font-size: 12px;');
console.log('%cPowered by VLLM - Offline AI Learning', 'color: #999; font-size: 11px;');
