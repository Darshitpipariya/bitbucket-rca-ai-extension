# BugZilla RCA Helper - Project Context

This document provides a comprehensive overview of the `bitbucket-rca-ai-extension` repository. It is designed to help any LLM code assistant understand the implementation details, architecture, and core logic of the extension.

## Overview
**BugZilla RCA Helper** is a Chrome Extension built with Vanilla HTML, CSS, and JavaScript. Its primary function is to read Bitbucket Pull Request (PR) or Commit URLs, fetch the code diffs and metadata using the Bitbucket API, and then generate a human-readable Root Cause Analysis (RCA) report using Google's Gemini AI.

## Architecture and File Structure

- **`manifest.json`**
  - Defines the Chrome Extension metadata (Manifest V3).
  - Configures `background.js` as the service worker.
  - Sets up the `sidePanel` pointing to `popup.html`.
  - Defines host permissions for Bitbucket API (`api.bitbucket.org`), Bitbucket web (`bitbucket.org`), and Gemini API (`generativelanguage.googleapis.com`).

- **`config.js`**
  - Contains all the static configurations, API endpoints, storage keys, and URL regex patterns (`BITBUCKET_PR_PATTERN` and `BITBUCKET_COMMIT_PATTERN`).
  - Contains the `RCA_PROMPT_TEMPLATE`, which is the core prompt sent to Gemini AI to generate the report structure.

- **`background.js`**
  - The extension's service worker.
  - Listens for messages from the popup (e.g., `generateRCA`, `validateApiKey`).
  - Orchestrates the main flow: 
    1. Validates the URL.
    2. Fetches credentials from Chrome Storage.
    3. Calls `BitbucketUtils` to fetch PR or Commit data.
    4. Calls `RCAGenerator` to send data to Gemini.
    5. Returns the generated markdown back to the popup.

- **`popup.html` / `popup.js` / `popup.css`**
  - The UI for the extension, designed to be opened in the Chrome Side Panel.
  - `popup.js` handles user inputs, renders chat history from Chrome Storage, sends messages to `background.js`, and parses the returned Markdown to display as HTML in a chat-like interface.

- **`settings.html` / `settings.js`**
  - A dedicated settings page where users configure their Atlassian Email, Bitbucket API Token (for private repos), and Gemini API Key.
  - Saves all credentials securely into Chrome Extension Storage via `StorageUtils`.

### Utilities (`utils/`)

- **`utils/storage.js`** (`StorageUtils`)
  - A wrapper around `chrome.storage.local` to get, set, and remove configuration values and chat history.

- **`utils/bitbucket.js`** (`BitbucketUtils`)
  - Handles parsing of Bitbucket URLs (both Pull Requests and Commits).
  - Uses the Bitbucket V2 API (`https://api.bitbucket.org/2.0/repositories/...`).
  - `fetchData(url, email, tk)` determines if the URL is a PR or Commit, then calls the respective endpoints:
    - PRs: `/pullrequests/{id}` and `/pullrequests/{id}/diff`
    - Commits: `/commit/{id}` and `/diff/{id}`
  - Normalizes the returned payload into a standard object containing `title`, `description`, `author`, `diff`, and `type`.

- **`utils/rca-generator.js`** (`RCAGenerator`)
  - Interacts with the Gemini API (`gemini-3-flash-preview`).
  - Extracts the list of files changed from the raw git diff.
  - Replaces tokens in `CONFIG.RCA_PROMPT_TEMPLATE` with the fetched Bitbucket data (`title`, `description`, `diff`, `author`, etc.).
  - Truncates the diff if it exceeds 8000 characters to prevent token limit errors.
  - Returns the generated RCA Markdown.

## Logic Flow (RCA Generation)

1. User opens the Side Panel and pastes a Bitbucket URL into `popup.html`.
2. `popup.js` validates the URL syntax using `BitbucketUtils.isValidUrl()`.
3. `popup.js` sends `chrome.runtime.sendMessage({ action: 'generateRCA', url: <url> })` to `background.js`.
4. `background.js` reads `geminiApiKey`, `bitbucketEmail`, and `bitbucketToken` from `chrome.storage.local`.
5. `background.js` calls `BitbucketUtils.fetchData()`.
   - If PR URL: Fetches PR metadata and diff.
   - If Commit URL: Fetches Commit metadata and diff.
6. `background.js` passes the normalized metadata and diff to `RCAGenerator.generateRCA()`.
7. `RCAGenerator` hits the Gemini endpoint and returns the generated Markdown string.
8. `background.js` sends the Markdown back to `popup.js`.
9. `popup.js` saves the exchange to `chatHistory` and renders the markdown in the UI using simple regex markdown parsing.

## Technologies Used
- Chrome Extensions API (Manifest V3, Service Workers, Side Panel, Storage)
- Vanilla HTML/CSS/JS (No frameworks like React or Vue)
- Fetch API for network requests
- Google Generative AI (Gemini HTTP REST API)
- Bitbucket API v2 (Basic Auth with user/App Password)
