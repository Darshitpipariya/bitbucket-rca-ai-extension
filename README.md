# Bitbucket RCA AI Extension

> 🤖 AI-powered Chrome extension that generates comprehensive Root Cause Analysis reports from Bitbucket Pull Requests using Google Gemini AI.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/Darshitpipariya/bitbucket-rca-ai-extension)

![Extension Banner](https://github.com/Darshitpipariya/bitbucket-rca-ai-extension/blob/main/icons/icon128.png)

## ✨ Features

- 🤖 **AI-Powered Analysis** - Leverages Google Gemini AI to analyze code changes
- 📱 **Side Panel Interface** - Persistent chat window that stays open while browsing
- 📋 **Markdown Export** - One-click copy to paste into Jira, Confluence, or any platform
- 🔒 **Privacy First** - All data stored locally, no external tracking
- ⚡ **Fast & Efficient** - Generate RCA reports in seconds
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations

## 📊 What You Get

Each RCA report includes:

- **Bug Summary** - Clear explanation of the issue or feature
- **Root Cause Analysis** - Why the problem occurred
- **Fix Description** - What was changed to resolve it
- **Testing Details** - How the fix was verified
- **Impact Analysis** - Areas affected by the change
- **End-User Impact** - How users benefit from the change

## 🚀 Installation

### From Chrome Web Store (Recommended)
*Coming soon - Currently in review*

### Manual Installation (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Darshitpipariya/bitbucket-rca-ai-extension.git
   cd bitbucket-rca-ai-extension
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the cloned repository folder

3. **Configure API Keys**
   - Click the extension icon
   - Go to Settings
   - Add your Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
   - (Optional) Add Bitbucket credentials for private repos

## 🛠️ Requirements

- **Google Gemini API Key** - Free tier available at [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Bitbucket Account** - For private repos, you'll need an API token

## 📖 Usage

1. **Open the Side Panel**
   - Click the extension icon in Chrome toolbar
   - The side panel will open on the right side

2. **Generate RCA**
   - Paste a Bitbucket PR URL (e.g., `https://bitbucket.org/workspace/repo/pull-requests/123`)
   - Click "Send" or press Enter
   - Wait for AI to analyze the changes

3. **Copy & Share**
   - Hover over the RCA report
   - Click "Copy MD" button
   - Paste into Jira, Confluence, Slack, or anywhere!

## 🎯 Perfect For

- 👨‍💻 Software Engineers reviewing PRs
- 🧪 QA Teams documenting bug fixes
- 📊 Project Managers tracking changes
- 🚀 DevOps teams analyzing deployments
- 📝 Anyone working with Bitbucket repositories

## 🔒 Privacy & Security

- ✅ No data collection or tracking
- ✅ API keys stored locally in your browser
- ✅ All communications use HTTPS
- ✅ Open source and transparent
- ✅ Minimal permissions requested

Read our [Privacy Policy](PRIVACY_POLICY.md) for details.

## 🏗️ Tech Stack

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks, lightweight and fast
- **Google Gemini AI** - Advanced AI for code analysis
- **Bitbucket API v2** - Pull request data fetching
- **Chrome Storage API** - Secure local data storage

## 📁 Project Structure

```
bitbucket-rca-ai-extension/
├── manifest.json           # Extension manifest
├── background.js          # Service worker
├── popup.html            # Side panel UI
├── popup.js              # Side panel logic
├── popup.css             # Styling
├── settings.html         # Settings page
├── settings.js           # Settings logic
├── config.js             # Configuration
├── utils/
│   ├── storage.js        # Storage utilities
│   ├── bitbucket.js      # Bitbucket API integration
│   └── rca-generator.js  # AI RCA generation
└── icons/                # Extension icons
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - For powerful AI capabilities
- [Bitbucket](https://bitbucket.org/) - For excellent API documentation
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) - For comprehensive documentation

## 📧 Contact

**Darshit Pipariya**
- GitHub: [@Darshitpipariya](https://github.com/Darshitpipariya)
- Email: [darshit2272000@gmail.com](mailto:darshit2272000@gmail.com)

## 🌟 Show Your Support

If you find this extension helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ by Darshit Pipariya**
