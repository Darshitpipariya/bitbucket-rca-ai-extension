// Storage utility functions for Chrome extension
const StorageUtils = {
    /**
     * Save data to Chrome storage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {Promise<void>}
     */
    async save(key, value) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: value }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    },

    /**
     * Get data from Chrome storage
     * @param {string} key - Storage key
     * @returns {Promise<any>}
     */
    async get(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result[key]);
                }
            });
        });
    },

    /**
     * Remove data from Chrome storage
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async remove(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove([key], () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    },

    /**
     * Save Gemini API key
     * @param {string} apiKey - Gemini API key
     * @returns {Promise<void>}
     */
    async saveGeminiApiKey(apiKey) {
        return this.save(CONFIG.STORAGE_KEYS.GEMINI_API_KEY, apiKey);
    },

    /**
     * Get Gemini API key
     * @returns {Promise<string|null>}
     */
    async getGeminiApiKey() {
        return this.get(CONFIG.STORAGE_KEYS.GEMINI_API_KEY);
    },

    /**
   * Save Bitbucket email
   * @param {string} email - Bitbucket/Atlassian account email
   * @returns {Promise<void>}\n   */
    async saveBitbucketEmail(email) {
        return this.save(CONFIG.STORAGE_KEYS.BITBUCKET_EMAIL, email);
    },

    /**
     * Get Bitbucket email
     * @returns {Promise<string|null>}
     */
    async getBitbucketEmail() {
        return this.get(CONFIG.STORAGE_KEYS.BITBUCKET_EMAIL);
    },

    /**
     * Save Bitbucket token
     * @param {string} token - Bitbucket app password
     * @returns {Promise<void>}
     */
    async saveBitbucketToken(token) {
        return this.save(CONFIG.STORAGE_KEYS.BITBUCKET_TOKEN, token);
    },

    /**
     * Get Bitbucket token
       * @returns {Promise<string|null>}
       */
    async getBitbucketToken() {
        return this.get(CONFIG.STORAGE_KEYS.BITBUCKET_TOKEN);
    },

    /**
     * Save chat history
     * @param {Array} history - Chat message history
     * @returns {Promise<void>}
     */
    async saveChatHistory(history) {
        // Limit history size
        const limitedHistory = history.slice(-CONFIG.MAX_CHAT_HISTORY);
        return this.save(CONFIG.STORAGE_KEYS.CHAT_HISTORY, limitedHistory);
    },

    /**
     * Get chat history
     * @returns {Promise<Array>}
     */
    async getChatHistory() {
        const history = await this.get(CONFIG.STORAGE_KEYS.CHAT_HISTORY);
        return history || [];
    },

    /**
     * Clear chat history
     * @returns {Promise<void>}
     */
    async clearChatHistory() {
        return this.remove(CONFIG.STORAGE_KEYS.CHAT_HISTORY);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageUtils;
}
