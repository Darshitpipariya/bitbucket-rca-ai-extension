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
     * Parse Bitbucket Commit URL
     * @param {string} url - Bitbucket Commit URL
     * @returns {Object|null} - Parsed Commit info or null if invalid
     */
    parseCommitUrl(url) {
        const match = url.match(CONFIG.BITBUCKET_COMMIT_PATTERN);
        if (!match) {
            return null;
        }

        return {
            workspace: match[1],
            repoSlug: match[2],
            commitId: match[3],
            url: url
        };
    },

    /**
     * Validate Bitbucket Commit URL
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    isValidCommitUrl(url) {
        return CONFIG.BITBUCKET_COMMIT_PATTERN.test(url);
    },

    /**
     * Validate any supported Bitbucket URL (PR or Commit)
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    isValidUrl(url) {
        return this.isValidPRUrl(url) || this.isValidCommitUrl(url);
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
     * Fetch Commit details from Bitbucket API
     * @param {Object} commitInfo - Parsed Commit info
     * @param {string} email - Atlassian account email (optional)
     * @param {string} apiToken - Bitbucket API token (optional)
     * @returns {Promise<Object>}
     */
    async fetchCommitDetails(commitInfo, email = null, apiToken = null) {
        const { workspace, repoSlug, commitId } = commitInfo;
        const url = `${CONFIG.BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/commit/${commitId}`;

        const headers = {
            'Accept': 'application/json'
        };

        if (email && apiToken) {
            const credentials = btoa(`${email}:${apiToken}`);
            headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);

            if ((response.status === 401 || response.status === 403) && (!email || !apiToken)) {
                throw new Error(`Failed to fetch Commit details: ${response.status}. This might be a private repository. Please configure your Atlassian email and API token in settings.`);
            }

            throw new Error(`Failed to fetch Commit details: ${response.status} ${errorText}`);
        }

        return response.json();
    },

    /**
     * Fetch Commit diff from Bitbucket API
     * @param {Object} commitInfo - Parsed Commit info
     * @param {string} email - Atlassian account email (optional)
     * @param {string} apiToken - Bitbucket API token (optional)
     * @returns {Promise<string>}
     */
    async fetchCommitDiff(commitInfo, email = null, apiToken = null) {
        const { workspace, repoSlug, commitId } = commitInfo;
        const url = `${CONFIG.BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/diff/${commitId}`;

        const headers = {
            'Accept': 'text/plain'
        };

        if (email && apiToken) {
            const credentials = btoa(`${email}:${apiToken}`);
            headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);

            if ((response.status === 401 || response.status === 403) && (!email || !apiToken)) {
                throw new Error(`Failed to fetch Commit diff: ${response.status}. This might be a private repository. Please configure your Atlassian email and API token in settings.`);
            }

            throw new Error(`Failed to fetch Commit diff: ${response.status} ${errorText}`);
        }

        return response.text();
    },

    /**
     * Fetch complete data (PR or Commit) including details and diff
     * @param {string} url - Bitbucket URL
     * @param {string} email - Atlassian account email (optional)
     * @param {string} apiToken - Bitbucket API token (optional)
     * @returns {Promise<Object>}
     */
    async fetchData(url, email = null, apiToken = null) {
        if (this.isValidPRUrl(url)) {
            const prInfo = this.parsePRUrl(url);
            try {
                const [details, diff] = await Promise.all([
                    this.fetchPRDetails(prInfo, email, apiToken),
                    this.fetchPRDiff(prInfo, email, apiToken)
                ]);

                return {
                    type: 'pull-request',
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
        } else if (this.isValidCommitUrl(url)) {
            const commitInfo = this.parseCommitUrl(url);
            try {
                const [details, diff] = await Promise.all([
                    this.fetchCommitDetails(commitInfo, email, apiToken),
                    this.fetchCommitDiff(commitInfo, email, apiToken)
                ]);

                // Split commit message into title (first line) and description (rest)
                const msgLines = (details.message || '').split('\n');
                const title = msgLines[0] || 'No commit message';
                const description = msgLines.slice(1).join('\n').trim() || 'No description provided';

                return {
                    type: 'commit',
                    title: title,
                    description: description,
                    author: details.author?.user?.display_name || details.author?.raw || 'Unknown',
                    created: details.date,
                    state: 'merged', // Commits are inherently merged
                    source: 'N/A',
                    destination: 'N/A',
                    diff: diff,
                    url: url
                };
            } catch (error) {
                console.error('Error fetching commit data:', error);
                throw error;
            }
        } else {
            throw new Error('Invalid Bitbucket URL. Only Pull Requests and Commits are supported.');
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
