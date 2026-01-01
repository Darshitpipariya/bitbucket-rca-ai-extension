// RCA Generator using Gemini AI
const RCAGenerator = {
    /**
     * Generate RCA using Gemini AI
     * @param {Object} prData - PR data from Bitbucket
     * @param {string} apiKey - Gemini API key
     * @param {string} url - PR URL
     * @returns {Promise<string>}
     */
    async generateRCA(prData, apiKey, url) {
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }

        // Extract files from diff
        const files = BitbucketUtils.extractFilesFromDiff(prData.diff);
        const filesText = files.length > 0
            ? files.map(f => `- ${f}`).join('\n')
            : 'No files changed';

        // Build prompt from template
        const prompt = CONFIG.RCA_PROMPT_TEMPLATE
            .replace('{{title}}', prData.title)
            .replace('{{description}}', prData.description)
            .replace('{{author}}', prData.author)
            .replace('{{created}}', new Date(prData.created).toLocaleString())
            .replace('{{files}}', filesText)
            .replace('{{diff}}', this.truncateDiff(prData.diff, 8000))
            .replace('{{fix_url}}', url); // Limit diff size

        // Call Gemini API
        const response = await this.callGeminiAPI(prompt, apiKey);
        return response;
    },

    /**
     * Call Gemini API
     * @param {string} prompt - Prompt text
     * @param {string} apiKey - Gemini API key
     * @returns {Promise<string>}
     */
    async callGeminiAPI(prompt, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();

            // Extract text from response
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    return candidate.content.parts[0].text;
                }
            }

            throw new Error('No response generated from Gemini API');
        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    },

    /**
     * Truncate diff to fit within token limits
     * @param {string} diff - Full diff text
     * @param {number} maxChars - Maximum characters
     * @returns {string}
     */
    truncateDiff(diff, maxChars = 8000) {
        if (diff.length <= maxChars) {
            return diff;
        }

        const truncated = diff.substring(0, maxChars);
        return truncated + '\n\n... (diff truncated for length)';
    },

    /**
     * Format RCA response for display
     * @param {string} rca - Raw RCA text
     * @returns {string}
     */
    formatRCA(rca) {
        // The RCA is already in markdown format from Gemini
        return rca.trim();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RCAGenerator;
}
