# Privacy Policy for BugZilla RCA Helper

**Last Updated:** January 1, 2026

## Overview

BugZilla RCA Helper ("the Extension") is committed to protecting your privacy. This privacy policy explains how the Extension handles your data.

## Data Collection

**The Extension does NOT collect, store, or transmit any personal data to external servers.**

### What Data is Stored Locally

The Extension stores the following data **locally on your device only** using Chrome's local storage API:

1. **API Keys:**
   - Google Gemini API key
   - Bitbucket email and API token (if configured)
   - Stored encrypted in your browser's local storage
   - Never transmitted to any server except the respective API services

2. **Chat History:**
   - Your PR URLs and generated RCA reports
   - Stored locally for your convenience
   - Can be cleared at any time using the "Clear History" button

3. **Extension Settings:**
   - User preferences and configuration
   - Stored locally in your browser

### Data Transmission

The Extension communicates with the following third-party services:

1. **Google Gemini AI API** (generativelanguage.googleapis.com)
   - Purpose: Generate RCA reports from code changes
   - Data sent: PR code diffs and metadata
   - Privacy: Subject to [Google's Privacy Policy](https://policies.google.com/privacy)

2. **Bitbucket API** (api.bitbucket.org)
   - Purpose: Fetch pull request details and code diffs
   - Data sent: Your Bitbucket credentials (email + API token)
   - Privacy: Subject to [Atlassian's Privacy Policy](https://www.atlassian.com/legal/privacy-policy)

**All API communications use HTTPS encryption.**

## Data Security

- API keys are stored locally using Chrome's secure storage API
- No data is sent to any servers controlled by the Extension developer
- No analytics, tracking, or telemetry is collected
- No cookies are used
- No user behavior is monitored

## Third-Party Services

The Extension integrates with:

1. **Google Gemini AI** - For AI-powered code analysis
2. **Bitbucket** - For fetching pull request data

Please review their respective privacy policies:
- [Google Privacy Policy](https://policies.google.com/privacy)
- [Atlassian Privacy Policy](https://www.atlassian.com/legal/privacy-policy)

## User Rights

You have complete control over your data:

- **View:** All data is stored locally and accessible through Chrome DevTools
- **Delete:** Clear chat history anytime using the "Clear History" button
- **Export:** Copy RCA reports in markdown format
- **Remove:** Uninstall the Extension to remove all local data

## Permissions Explained

The Extension requests the following permissions:

1. **storage** - To save API keys and chat history locally
2. **sidePanel** - To display the side panel interface
3. **Host permissions:**
   - `bitbucket.org` - To detect Bitbucket pages
   - `api.bitbucket.org` - To fetch PR data
   - `generativelanguage.googleapis.com` - To call Gemini AI API

**The Extension does NOT request:**
- Access to your browsing history
- Access to your tabs or websites (except Bitbucket)
- Access to your downloads
- Access to your bookmarks

## Children's Privacy

The Extension is not directed to children under 13 years of age. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.

## Open Source

The Extension is open source. You can review the complete source code to verify our privacy practices.

## Contact

If you have questions about this privacy policy or the Extension's data practices, please contact:

**Developer:** Darshit Pipariya  
**Email:** [Your Email]  
**GitHub:** [Your GitHub Repository URL]

## Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

---

**Summary:** BugZilla RCA Helper stores your API keys and chat history locally on your device. No personal data is collected, tracked, or transmitted to the developer. All API communications are with Google Gemini AI and Bitbucket using HTTPS encryption.
