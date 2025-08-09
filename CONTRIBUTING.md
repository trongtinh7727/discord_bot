# Contributing to Discord TTS Bot

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/discord_bot.git`
3. **Create** a branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes
5. **Test** your changes
6. **Commit** your changes: `git commit -m "Add your feature"`
7. **Push** to your fork: `git push origin feature/your-feature-name`
8. **Create** a Pull Request

## 📋 Before You Start

- Check existing [issues](https://github.com/trongtinh7727/discord_bot/issues) and [pull requests](https://github.com/trongtinh7727/discord_bot/pulls)
- For major changes, create an issue first to discuss the proposal
- Make sure you have Node.js 16+ installed
- Test your changes with a real Discord bot

## 🔧 Development Setup

```bash
# Install dependencies
npm install

# Copy example config
cp config.json.example config.json

# Edit with your bot token
nano config.json

# Run the bot
node app.js
```

## 📝 Coding Standards

### JavaScript Style
- Use `const` and `let` instead of `var`
- Use meaningful variable names
- Add JSDoc comments for functions
- Use async/await instead of callbacks
- Handle errors properly with try/catch

### Example:
```javascript
/**
 * Processes the TTS queue
 * @returns {Promise<void>}
 */
async function processQueue() {
    if (textQueue.length === 0 || ttsService.isSpeaking) return;
    
    try {
        const { text, voiceChannel } = textQueue.shift();
        await ttsService.handleTTS(text, voiceChannel);
    } catch (error) {
        console.error('Error processing queue:', error);
    }
}
```

### File Structure
```
├── app.js              # Main bot file
├── TTSService.js       # TTS handling service
├── config.json         # Bot configuration
├── package.json        # Dependencies
├── docker-compose.yml  # Docker configuration
├── .github/workflows/  # GitHub Actions
└── deploy.sh          # Deployment script
```

## 🧪 Testing

### Manual Testing
1. Create a test Discord server
2. Invite your bot with appropriate permissions
3. Test all commands in voice channels
4. Verify queue functionality
5. Test admin commands

### Test Checklist
- [ ] Bot connects successfully
- [ ] TTS commands work in voice channels
- [ ] Queue system handles multiple requests
- [ ] Admin commands are restricted properly
- [ ] Error messages are user-friendly
- [ ] Performance is acceptable

## 📤 Pull Request Guidelines

### PR Title Format
```
[Type] Brief description

Examples:
[Feature] Add multi-language TTS support
[Fix] Resolve queue processing bug
[Docs] Update installation instructions
[Refactor] Improve error handling
```

### PR Description Template
```markdown
## Changes Made
- Describe your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tested locally
- [ ] Tested with real Discord bot
- [ ] All existing features still work

## Screenshots (if applicable)

## Additional Notes
```

## 🐛 Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
Clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10, Ubuntu 20.04]
- Node.js version: [e.g. 18.17.0]
- Bot version: [e.g. v1.2.0]

**Additional Context**
Add any other context about the problem.
```

## 💡 Feature Requests

For feature requests, please provide:
- **Problem**: What problem does this solve?
- **Solution**: How should it work?
- **Alternatives**: Other ways to solve this
- **Impact**: Who benefits from this feature?

## 🏷️ Issue Labels

We use these labels to organize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - Critical issues
- `priority:low` - Nice to have

## 📞 Getting Help

- 💬 Join our [Discord Server](https://discord.gg/your-server)
- 📧 Email: your-email@example.com
- 🐛 Create an [issue](https://github.com/trongtinh7727/discord_bot/issues)

## 🙏 Recognition

Contributors will be recognized in:
- README.md Contributors section
- GitHub contributors page
- Discord server (if applicable)

Thank you for contributing! 🎉
