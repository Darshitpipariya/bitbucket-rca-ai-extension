// Settings page script
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
});

/**
 * Load existing settings
 */
async function loadSettings() {
    try {
        // Load Gemini API key
        const geminiApiKey = await StorageUtils.getGeminiApiKey();
        if (geminiApiKey) {
            document.getElementById('geminiApiKey').value = geminiApiKey;
            updateStatus('gemini', true);
        } else {
            updateStatus('gemini', false);
        }

        // Load Bitbucket email
        const bitbucketEmail = await StorageUtils.getBitbucketEmail();
        if (bitbucketEmail) {
            document.getElementById('bitbucketEmail').value = bitbucketEmail;
        }

        // Load Bitbucket API token
        const bitbucketToken = await StorageUtils.getBitbucketToken();
        if (bitbucketToken) {
            document.getElementById('bitbucketToken').value = bitbucketToken;
        }

        // Update status based on both fields
        if (bitbucketEmail && bitbucketToken) {
            updateStatus('bitbucket', true);
        } else {
            updateStatus('bitbucket', false);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showAlert('error', 'Failed to load settings: ' + error.message);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('saveGeminiBtn').addEventListener('click', handleSaveGemini);
    document.getElementById('testGeminiBtn').addEventListener('click', handleTestGemini);
    document.getElementById('saveBitbucketBtn').addEventListener('click', handleSaveBitbucket);
    document.getElementById('clearBitbucketBtn').addEventListener('click', handleClearBitbucket);
}

/**
 * Handle save Gemini API key
 */
async function handleSaveGemini() {
    const apiKey = document.getElementById('geminiApiKey').value.trim();

    if (!apiKey) {
        showAlert('error', 'Please enter a Gemini API key');
        return;
    }

    try {
        await StorageUtils.saveGeminiApiKey(apiKey);
        updateStatus('gemini', true);
        showAlert('success', 'Gemini API key saved successfully!');
    } catch (error) {
        console.error('Error saving Gemini API key:', error);
        showAlert('error', 'Failed to save API key: ' + error.message);
    }
}

/**
 * Handle test Gemini API key
 */
async function handleTestGemini() {
    const apiKey = document.getElementById('geminiApiKey').value.trim();

    if (!apiKey) {
        showAlert('error', 'Please enter a Gemini API key');
        return;
    }

    const testBtn = document.getElementById('testGeminiBtn');
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';

    try {
        // Test the API key
        const testPrompt = 'Say "API key is valid" if you can read this.';
        await RCAGenerator.callGeminiAPI(testPrompt, apiKey);

        showAlert('success', '✅ API key is valid! You can now use the extension.');
        updateStatus('gemini', true);
    } catch (error) {
        console.error('API key test failed:', error);
        showAlert('error', '❌ API key test failed: ' + error.message);
        updateStatus('gemini', false);
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = 'Test API Key';
    }
}

/**
 * Handle save Bitbucket credentials
 */
async function handleSaveBitbucket() {
    const email = document.getElementById('bitbucketEmail').value.trim();
    const apiToken = document.getElementById('bitbucketToken').value.trim();

    if (!email || !apiToken) {
        showAlert('error', 'Please enter both Atlassian email and API token');
        return;
    }

    try {
        await StorageUtils.saveBitbucketEmail(email);
        await StorageUtils.saveBitbucketToken(apiToken);
        updateStatus('bitbucket', true);
        showAlert('success', 'Bitbucket credentials saved successfully!');
    } catch (error) {
        console.error('Error saving Bitbucket credentials:', error);
        showAlert('error', 'Failed to save credentials: ' + error.message);
    }
}

/**
 * Handle clear Bitbucket credentials
 */
async function handleClearBitbucket() {
    try {
        await StorageUtils.remove(CONFIG.STORAGE_KEYS.BITBUCKET_EMAIL);
        await StorageUtils.remove(CONFIG.STORAGE_KEYS.BITBUCKET_TOKEN);
        document.getElementById('bitbucketEmail').value = '';
        document.getElementById('bitbucketToken').value = '';
        updateStatus('bitbucket', false);
        showAlert('success', 'Bitbucket credentials cleared');
    } catch (error) {
        console.error('Error clearing Bitbucket credentials:', error);
        showAlert('error', 'Failed to clear credentials: ' + error.message);
    }
}

/**
 * Update status indicator
 */
function updateStatus(type, isConfigured) {
    const statusId = type === 'gemini' ? 'geminiStatus' : 'bitbucketStatus';
    const statusEl = document.getElementById(statusId);

    if (isConfigured) {
        statusEl.innerHTML = `
      <span class="status-indicator configured">
        <span class="status-dot"></span>
        Configured
      </span>
    `;
    } else {
        statusEl.innerHTML = `
      <span class="status-indicator not-configured">
        <span class="status-dot"></span>
        Not configured
      </span>
    `;
    }
}

/**
 * Show alert message
 */
function showAlert(type, message) {
    const alertId = type === 'success' ? 'alertSuccess' : 'alertError';
    const alertEl = document.getElementById(alertId);

    // Hide other alerts
    document.querySelectorAll('.alert').forEach(el => {
        el.classList.remove('show');
    });

    // Show alert
    alertEl.textContent = message;
    alertEl.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertEl.classList.remove('show');
    }, 5000);
}
