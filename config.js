// Configuration constants for the extension
const CONFIG = {
  // Gemini AI Configuration
  GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',

  // Bitbucket API Configuration
  BITBUCKET_API_BASE: 'https://api.bitbucket.org/2.0',

  // Storage Keys
  STORAGE_KEYS: {
    GEMINI_API_KEY: 'gemini_api_key',
    BITBUCKET_EMAIL: 'bitbucket_email',
    BITBUCKET_TOKEN: 'bitbucket_token',
    CHAT_HISTORY: 'chat_history',
    SETTINGS: 'settings'
  },

  // URL Patterns
  BITBUCKET_PR_PATTERN: /^https?:\/\/bitbucket\.org\/([^\/]+)\/([^\/]+)\/pull-requests\/(\d+)/,

  // UI Constants
  MAX_CHAT_HISTORY: 50,
  TYPING_DELAY: 50,

  // RCA Prompt Template
  RCA_PROMPT_TEMPLATE: `Read the code changes below and rewrite the content under each section in clear, simple language that non-technical users can understand.

STRICT RULES:
- Do NOT change, rename, reorder, or remove any section headers.
- Keep the exact output structure and section order.
- Only rewrite the content under each header.
- Do NOT add new sections or extra explanations.
- Keep all existing information, but make it more human-readable.
- Be concise and clear.

---
**Bug Summary**
Explain the issue or feature in simple, non-technical terms.

**Root Cause Analysis**
Explain why the issue occurred or why the change was required, in plain language.

**Fix Description**
Explain what was changed to resolve the issue or add the feature, simply and clearly.

**Files Changed**
{{files}}

**Testing Details**
Explain how the change was verified or tested, in easy-to-understand terms.

**Impact on Related Areas**
Mention any other areas that could be affected by this change, if applicable.

**End-User Impact**
Explain how this change improves the user experience or behavior.

**Code Changes:**
{{diff}}
`


};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
