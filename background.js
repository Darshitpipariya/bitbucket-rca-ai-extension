// Side panel opener - handles extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Open the side panel when extension icon is clicked
    chrome.sidePanel.open({ windowId: tab.windowId });
});

// Existing background script code
importScripts('config.js', 'utils/storage.js', 'utils/bitbucket.js', 'utils/rca-generator.js');

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateRCA') {
        handleGenerateRCA(request.url)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    }

    if (request.action === 'validateApiKey') {
        handleValidateApiKey(request.apiKey)
            .then(response => sendResponse({ success: true, data: response }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

/**
 * Handle RCA generation request
 * @param {string} url - Bitbucket PR URL
 * @returns {Promise<Object>}
 */
async function handleGenerateRCA(url) {
    try {
        // Validate URL
        if (!BitbucketUtils.isValidUrl(url)) {
            throw new Error('Invalid Bitbucket URL. Please provide a valid pull request or commit URL.');
        }

        // Get API keys from storage
        const geminiApiKey = await StorageUtils.getGeminiApiKey();
        if (!geminiApiKey) {
            throw new Error('Gemini API key not configured. Please set it in the settings.');
        }

        // Get Bitbucket credentials from storage
        const bitbucketEmail = await StorageUtils.getBitbucketEmail();
        console.log('Bitbucket email:', bitbucketEmail);
        const bitbucketApiToken = await StorageUtils.getBitbucketToken();

        // Fetch data from Bitbucket (PR or Commit)
        console.log('Fetching data from Bitbucket...');
        const data = await BitbucketUtils.fetchData(url, bitbucketEmail, bitbucketApiToken);

        // Generate RCA using Gemini AI
        console.log('Generating RCA with Gemini AI...');
        const rca = await RCAGenerator.generateRCA(data, geminiApiKey, url);

        return {
            rca: RCAGenerator.formatRCA(rca),
            prData: {
                title: data.title,
                author: data.author,
                url: data.url,
                type: data.type
            }
        };
    } catch (error) {
        console.error('Error generating RCA:', error);
        throw error;
    }
}

/**
 * Validate Gemini API key
 * @param {string} apiKey - API key to validate
 * @returns {Promise<boolean>}
 */
async function handleValidateApiKey(apiKey) {
    try {
        const testPrompt = 'Say "API key is valid" if you can read this.';
        await RCAGenerator.callGeminiAPI(testPrompt, apiKey);
        return true;
    } catch (error) {
        throw new Error('Invalid API key or API error: ' + error.message);
    }
}

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('BugZilla RCA Helper installed!');
        // Open settings page on first install
        chrome.tabs.create({ url: 'settings.html' });
    }
});

console.log('Background service worker loaded');
