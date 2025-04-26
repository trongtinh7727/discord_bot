# 🎶 Discord Music Bot

A simple and powerful Discord music bot that plays YouTube audio with queue and repeat features! Built with `discord.js`, `@discordjs/voice`, and `ytdl-core`.

## 🚀 Features

- 🔊 Join voice channels and play music from YouTube links
- 📃 Queue system — multiple songs in order
- 🔁 Repeat mode — auto replays the queue forever
- ⏭️ Skip tracks
- 📛 Stop and clear the queue
- ✨ Easy to use commands with prefix `!`

---

## 💻 Setup

### 1. Clone the repo

```bash
git clone https://github.com/TDung0807/TextToSpeech_Discord.git
cd TextToSpeech_Discord
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your bot token

Create a `config.json` file:

```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN"
}
```

> 🔐 **Never share your bot token!**

---

## ▶️ Run the bot

```bash
node app.js
```

The bot will go online if your token is correct!

---

## 🛠️ Commands

| Command         | Description                          |
|-----------------|--------------------------------------|
| `!play <url>`   | Add a YouTube song to the queue      |
| `!repeat`       | Toggle repeat mode on/off            |
| `!skip`         | Skip the current song                |
| `!stop`         | Stop playing and clear the queue     |
| `!tts <text>`   | Converts text to speech              |
| `!help`         | Display all command                  |

> ✅ You must be in a voice channel before using `!play`.

---

## 📆 Built With

- [discord.js](https://discord.js.org)
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork and level this up with volume control, search by keyword, or fancy embed UIs 😎

---

## 📄 License

MIT

---

Made with ❤️ by [trongtinh7727]

