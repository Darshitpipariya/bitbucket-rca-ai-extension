// Bitbucket API utility functions
const BitbucketUtils = {
    /**
     * Parse Bitbucket PR URL
     * @param {string} url - Bitbucket PR URL
     * @returns {Object|null} - Parsed PR info or null if invalid
     */
    parsePRUrl(url) {
        const match = url.match(CONFIG.BITBUCKET_PR_PATTERN);
        if (!match) {
            return null;
        }

        return {
            workspace: match[1],
            repoSlug: match[2],
            prId: match[3],
            url: url
        };
    },

    /**
     * Validate Bitbucket PR URL
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    isValidPRUrl(url) {
        return CONFIG.BITBUCKET_PR_PATTERN.test(url);
    },

    /**
     * Fetch PR details from Bitbucket API
     * @param {Object} prInfo - Parsed PR info
     * @param {string} email - Atlassian account email (optional)
     * @param {string} apiToken - Bitbucket API token (optional)
     * @returns {Promise<Object>}
     */
    async fetchPRDetails(prInfo, email = null, apiToken = null) {
        const { workspace, repoSlug, prId } = prInfo;
        const url = `${CONFIG.BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/pullrequests/${prId}`;

        const headers = {
            'Accept': 'application/json'
        };

        // Use Basic Auth if email and API token provided
        if (email && apiToken) {
            const credentials = btoa(`${email}:${apiToken}`);
            headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);

            // If 401/403 and no credentials provided, suggest adding them
            if ((response.status === 401 || response.status === 403) && (!email || !apiToken)) {
                throw new Error(`Failed to fetch PR details: ${response.status}. This might be a private repository. Please configure your Atlassian email and API token in settings.`);
            }

            throw new Error(`Failed to fetch PR details: ${response.status} ${errorText}`);
        }

        return response.json();
    },

    /**
     * Fetch PR diff from Bitbucket API
     * @param {Object} prInfo - Parsed PR info
     * @param {string} email - Atlassian account email (optional)
     * @param {string} apiToken - Bitbucket API token (optional)
     * @returns {Promise<string>}
     */
    async fetchPRDiff(prInfo, email = null, apiToken = null) {
        const { workspace, repoSlug, prId } = prInfo;
        const url = `${CONFIG.BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/pullrequests/${prId}/diff`;

        const headers = {
            'Accept': 'text/plain'
        };

        // Use Basic Auth if email and API token provided
        if (email && apiToken) {
            const credentials = btoa(`${email}:${apiToken}`);
            headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);

            // If 401/403 and no credentials provided, suggest adding them
            if ((response.status === 401 || response.status === 403) && (!email || !apiToken)) {
                throw new Error(`Failed to fetch PR diff: ${response.status}. This might be a private repository. Please configure your Atlassian email and API token in settings.`);
            }

            throw new Error(`Failed to fetch PR diff: ${response.status} ${errorText}`);
        }

        return response.text();
    },

    /**
     * Fetch complete PR data including details and diff
     * @param {string} url - Bitbucket PR URL
     * @param {string} email - Atlassian account email (optional)
     * @param {string} apiToken - Bitbucket API token (optional)
     * @returns {Promise<Object>}
     */
    async fetchPRData(url, email = null, apiToken = null) {
        const prInfo = this.parsePRUrl(url);

        if (!prInfo) {
            throw new Error('Invalid Bitbucket PR URL');
        }

        try {
            const [details, diff] = await Promise.all([
                this.fetchPRDetails(prInfo, email, apiToken),
                this.fetchPRDiff(prInfo, email, apiToken)
            ]);

            return {
                title: details.title,
                description: details.description || 'No description provided',
                author: details.author?.display_name || 'Unknown',
                created: details.created_on,
                state: details.state,
                source: details.source?.branch?.name,
                destination: details.destination?.branch?.name,
                diff: diff,
                url: url
            };
        } catch (error) {
            console.error('Error fetching PR data:', error);
            throw error;
        }
    },

    /**
     * Extract file list from diff
     * @param {string} diff - PR diff text
     * @returns {Array<string>}
     */
    extractFilesFromDiff(diff) {
        const files = [];
        const lines = diff.split('\n');

        for (const line of lines) {
            if (line.startsWith('diff --git')) {
                const match = line.match(/diff --git a\/(.+) b\/(.+)/);
                if (match) {
                    files.push(match[2]);
                }
            }
        }

        return files;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitbucketUtils;
}
