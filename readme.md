# 🗣️ Discord Text-to-Speech Bot

A powerful Discord TTS (Text-to-Speech) bot that converts text to speech with queue management and various language support! Built with `discord.js`, `@discordjs/voice`, and Google Translate TTS API.

## 🚀 Features

- 🔊 Join voice channels and speak text aloud
- 📃 Queue system — multiple TTS requests in order
- 🌍 Multi-language support (Vietnamese, English, Japanese, etc.)
- ⚡ Adjustable speech speed (0.5x - 5x)
- 👑 Admin controls for queue management
- 📊 Real-time status and statistics
- � Docker support for easy deployment
- 🚀 Auto-deployment with GitHub Actions
- ✨ Easy to use commands with prefix `!`

---

## 💻 Setup

### 1. Clone the repo

```bash
git clone https://github.com/trongtinh7727/discord_bot.git
cd discord_bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration

#### Option A: Environment Variables (Recommended for production)
```bash
# Create .env file
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
ADMIN_ROLE_ID=YOUR_ADMIN_ROLE_ID  # Optional: Restricts admin commands
```

#### Option B: Config file (For development)
Create a `config.json` file:

```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN"
}
```

> 🔐 **Never share your bot token!**

### 4. Additional Setup (Optional)

#### For YouTube support (if needed):
- Export YouTube cookies using [EditThisCookie](http://www.editthiscookie.com/)
- Save as `ytb_cookies.json` in the project root

#### System dependencies:
- **FFmpeg** (required for audio processing)
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
  - Ubuntu/Debian: `sudo apt install ffmpeg`
  - macOS: `brew install ffmpeg`

---

## ▶️ Run the bot

### Local Development
```bash
node app.js
```

### Docker (Recommended for production)
```bash
# Build and run
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

The bot will go online if your token is correct!

---

## 🛠️ Commands

### Basic Commands
| Command                  | Description                                    |
|--------------------------|------------------------------------------------|
| `!tts <text>`           | Convert text to speech and play in voice      |
| `!language <vi/en/ja>`  | Set TTS language (Vietnamese/English/Japanese)|
| `!adj <speed>`          | Adjust speech speed (0.5 - 5.0)              |
| `!queue`                | Show current TTS queue                         |
| `!stats`                | Show bot statistics and settings               |
| `!ping`                 | Check bot latency and server info              |
| `!help`                 | Display all commands                           |

### Admin Commands (Restricted)
| Command                  | Description                          |
|--------------------------|--------------------------------------|
| `!clearqueue`           | Clear the entire TTS queue           |
| `!remove <index>`       | Remove specific item from queue      |
| `!exit`                 | Shutdown the bot                      |

### Utility Commands
| Command                  | Description                          |
|--------------------------|--------------------------------------|
| `!stk`                  | Bank information display             |
| `!weather <city>`       | Get weather information              |
| `!qr`                   | Generate QR code                     |

> ✅ You must be in a voice channel before using `!tts`.
> 👑 Admin commands require specific role permissions (if configured).

---

## 📆 Built With

- [discord.js](https://discord.js.org) - Discord API library
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) - Voice connection handling
- [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) - Audio processing
- [node-fetch](https://www.npmjs.com/package/node-fetch) - HTTP requests
- [axios](https://www.npmjs.com/package/axios) - API calls
- Google Translate TTS API - Text-to-speech conversion

## 🚀 Deployment

### Automatic Deployment
This repository includes GitHub Actions for automatic deployment:

1. **Fork this repository**
2. **Set up your VPS secrets in GitHub:**
   - Go to `Settings` → `Secrets and variables` → `Actions`
   - Add `VPS_SSH_KEY` with your private SSH key content
3. **Push to main branch** - Auto deployment will trigger!

### Manual Deployment
```bash
# SSH to your server
ssh ubuntu@your-server-ip -i your-key.pem

# Run deploy script
cd /path/to/discord_bot
./deploy.sh
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Found a bug?
1. **Search existing issues** first to avoid duplicates
2. **Create a detailed issue** with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)

### ✨ Want to add a feature?
1. **Check existing issues** for feature requests
2. **Create an issue** to discuss the feature first
3. **Fork the repository**
4. **Create a feature branch**: `git checkout -b feature/amazing-feature`
5. **Make your changes** following our coding standards
6. **Test thoroughly**
7. **Submit a Pull Request**

### 📝 Coding Guidelines
- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code style and formatting
- Test your changes before submitting
- Update documentation if needed

### 🔧 Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/discord_bot.git
cd discord_bot

# Install dependencies
npm install

# Create config file
cp config.json.example config.json
# Edit config.json with your bot token

# Run in development mode
npm run dev  # or node app.js
```

### 📋 Pull Request Process
1. **Update README.md** if you change functionality
2. **Update the changelog** in your PR description
3. **Ensure all tests pass**
4. **Request review** from maintainers
5. **Address feedback** promptly

### 💡 Ideas for Contributions
- 🌐 Add more language support for TTS
- 🎵 Integrate music playback features
- 🎨 Create web dashboard interface
- 📱 Add mobile-friendly commands
- 🔧 Improve error handling
- 📊 Add more statistics and analytics
- 🔒 Enhance security features
- 🐳 Improve Docker configuration

### 🏆 Contributors Hall of Fame
Thank you to all contributors who help make this project better!

<!-- Contributors will be listed here -->

## 📞 Support

- 💬 **Discord Server**: [Join our community](https://discord.gg/your-server)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/trongtinh7727/discord_bot/issues)
- 📧 **Email**: your-email@example.com
- � **Feature Requests**: [GitHub Discussions](https://github.com/trongtinh7727/discord_bot/discussions)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Thanks to all contributors and users
- Google Translate for TTS API
- Discord.js community for excellent documentation
- Open source community for inspiration

---

**Made with ❤️ by [trongtinh7727](https://github.com/trongtinh7727)**

### ⭐ Star this repository if you found it helpful!

