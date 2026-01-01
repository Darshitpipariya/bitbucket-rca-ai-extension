// Popup script for chat interface
let chatHistory = [];
let isProcessing = false;

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const urlInput = document.getElementById('urlInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const settingsBtn = document.getElementById('settingsBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadChatHistory();
    setupEventListeners();
    checkApiKeyStatus();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    sendBtn.addEventListener('click', handleSendMessage);
    clearBtn.addEventListener('click', handleClearHistory);
    settingsBtn.addEventListener('click', handleOpenSettings);

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            handleSendMessage();
        }
    });

    // Auto-resize input
    urlInput.addEventListener('input', () => {
        urlInput.style.height = 'auto';
        urlInput.style.height = urlInput.scrollHeight + 'px';
    });
}

/**
 * Check if API key is configured
 */
async function checkApiKeyStatus() {
    const apiKey = await StorageUtils.getGeminiApiKey();
    if (!apiKey) {
        showMessage('assistant',
            '⚙️ **Setup Required**: Please configure your Gemini API key in settings to start generating RCA reports.',
            true
        );
    }
}

/**
 * Load chat history from storage
 */
async function loadChatHistory() {
    try {
        chatHistory = await StorageUtils.getChatHistory();

        // Clear welcome message if there's history
        if (chatHistory.length > 0) {
            const welcomeMsg = chatContainer.querySelector('.welcome-message');
            if (welcomeMsg) {
                welcomeMsg.remove();
            }

            // Display history
            chatHistory.forEach(msg => {
                displayMessage(msg.role, msg.content, msg.isError);
            });

            scrollToBottom();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

/**
 * Handle send message
 */
async function handleSendMessage() {
    const url = urlInput.value.trim();

    if (!url || isProcessing) {
        return;
    }

    // Validate URL
    if (!BitbucketUtils.isValidPRUrl(url)) {
        showError('Invalid Bitbucket PR URL. Please provide a valid pull request URL like: https://bitbucket.org/workspace/repo/pull-requests/123');
        return;
    }

    // Clear input
    urlInput.value = '';
    urlInput.style.height = 'auto';

    // Remove welcome message
    const welcomeMsg = chatContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    // Show user message
    showMessage('user', url);

    // Show loading
    const loadingId = showLoading();

    // Disable input
    isProcessing = true;
    sendBtn.disabled = true;
    urlInput.disabled = true;

    try {
        // Send message to background script
        const response = await chrome.runtime.sendMessage({
            action: 'generateRCA',
            url: url
        });

        // Remove loading
        removeLoading(loadingId);

        if (response.success) {
            // Show RCA
            const rcaMessage = formatRCAMessage(response.data);
            showMessage('assistant', rcaMessage);
        } else {
            showError(response.error || 'Failed to generate RCA. Please try again.');
        }
    } catch (error) {
        removeLoading(loadingId);
        showError('An error occurred: ' + error.message);
    } finally {
        // Re-enable input
        isProcessing = false;
        sendBtn.disabled = false;
        urlInput.disabled = false;
        urlInput.focus();
    }
}

/**
 * Format RCA message with PR info
 */
function formatRCAMessage(data) {
    const { rca, prData } = data;

    let message = ``;
    message += rca;
    message += `---\n\n`;
    message += `**PR:** [${prData.title}](${prData.url})\n`;
    message += `**Author:** ${prData.author}\n\n`;



    return message;
}

/**
 * Show message in chat
 */
function showMessage(role, content, isError = false) {
    // Add to history
    chatHistory.push({ role, content, isError, timestamp: Date.now() });
    StorageUtils.saveChatHistory(chatHistory);

    // Display message
    displayMessage(role, content, isError);
    scrollToBottom();
}

/**
 * Display message in chat container
 */
function displayMessage(role, content, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (isError) {
        contentDiv.innerHTML = `<div class="error-message">${escapeHtml(content)}</div>`;
    } else {
        // Add copy button for assistant messages (RCA reports)
        if (role === 'assistant') {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy MD
            `;
            copyBtn.onclick = () => handleCopyMarkdown(content, copyBtn);
            contentDiv.appendChild(copyBtn);
        }

        const textDiv = document.createElement('div');
        textDiv.className = role === 'assistant' ? 'message-text rca-content' : 'message-text';
        textDiv.innerHTML = parseMarkdown(content);
        contentDiv.appendChild(textDiv);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
}

/**
 * Handle copy markdown to clipboard
 */
async function handleCopyMarkdown(content, button) {
    try {
        await navigator.clipboard.writeText(content);

        // Update button to show success
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        button.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        button.textContent = 'Failed';
        setTimeout(() => {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy MD
            `;
        }, 2000);
    }
}

/**
 * Show error message
 */
function showError(message) {
    showMessage('assistant', message, true);
}

/**
 * Show loading indicator
 */
function showLoading() {
    const loadingId = 'loading-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = loadingId;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
    <div class="loading">
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
  `;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    scrollToBottom();

    return loadingId;
}

/**
 * Remove loading indicator
 */
function removeLoading(loadingId) {
    const loadingDiv = document.getElementById(loadingId);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

/**
 * Handle clear history
 */
async function handleClearHistory() {
    if (!confirm('Are you sure you want to clear chat history?')) {
        return;
    }

    chatHistory = [];
    await StorageUtils.clearChatHistory();

    // Clear chat container
    chatContainer.innerHTML = `
    <div class="welcome-message">
      <div class="welcome-icon">🔍</div>
      <h2>Welcome to BugZilla RCA Helper</h2>
      <p>Paste a Bitbucket Pull Request URL to generate a comprehensive Root Cause Analysis</p>
      <div class="example">
        <strong>Example:</strong>
        <code>https://bitbucket.org/workspace/repo/pull-requests/123</code>
      </div>
    </div>
  `;
}

/**
 * Handle open settings
 */
function handleOpenSettings() {
    chrome.tabs.create({ url: 'settings.html' });
}

/**
 * Scroll to bottom of chat
 */
function scrollToBottom() {
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

/**
 * Parse markdown to HTML (simple implementation)
 */
function parseMarkdown(text) {
    let html = escapeHtml(text);

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<pre')) {
        html = '<p>' + html + '</p>';
    }

    return html;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
