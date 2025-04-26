const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const TTSService = require('./TTSService');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const path = require('path');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

const distube = new DisTube(client, {
    leaveOnFinish: true,
    leaveOnStop: true,
    emitNewSongOnly: true,
    plugins: [new YtDlpPlugin()]
});


let globalSpeed = 1.0; // Default speed
const ttsService = new TTSService(globalSpeed);

const textQueue = [];
const MAX_QUEUE_SIZE = 5;
const MAX_TEXT_LENGTH = 200; // Maximum length for each text

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const [command, ...args] = message.content.split(' ');

    const commandHandlers = {
        '!tts': async () => {
            let text = args.join(' ');

            if (!text) {
                return message.reply('Please provide text to speak.');
            }

            if (text.length > MAX_TEXT_LENGTH) {
                return message.reply(`Text too long, max length is ${MAX_TEXT_LENGTH} characters.`);
            }

            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.reply('You need to join a voice channel first.');

            if (textQueue.length >= MAX_QUEUE_SIZE) {
                return message.reply('Queue is full, please wait a moment.');
            }

            textQueue.push({ text, voiceChannel });
            processQueue();
        },
        '!play': async () => {
            const url = args[0];
            if (!url) return message.reply('⛔ Hãy nhập một URL YouTube!');
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.reply('🔇 Bạn cần vào voice channel trước!');
            distube.play(voiceChannel, url, { textChannel: message.channel, member: message.member });
        },

        '!skip': async () => {
            const queue = distube.getQueue(message);
            if (!queue) return message.reply('❌ Không có bài nào đang phát!');
            queue.skip();
            message.reply('⏭️ Đã bỏ qua bài hát hiện tại!');
        },

        '!stop': async () => {
            const queue = distube.getQueue(message);
            if (!queue) return message.reply('❌ Không có gì để dừng!');
            queue.stop();
            message.reply('🛑 Đã dừng phát nhạc.');
        },

        '!repeat': async () => {
            const queue = distube.getQueue(message);
            if (!queue) return message.reply('❌ Không có gì để lặp lại!');
            const mode = distube.setRepeatMode(queue, (queue.repeatMode + 1) % 3); // 0: off, 1: song, 2: queue
            message.reply(`🔁 Repeat mode set to: ${mode === 0 ? 'OFF' : mode === 1 ? 'Song' : 'Queue'}`);
        },
        '!adj': async () => {
            if (args.length < 1) return message.reply('Please provide a speed value.');

            const speed = parseFloat(args[0]);
            if (isNaN(speed)) return message.reply('Invalid speed value.');

            if (speed < 0.5 || speed > 5) {
                return message.reply('Speed must be between 0.5 and 5.');
            }

            ttsService.globalSpeed = speed;
            message.reply(`Speech speed adjusted to ${speed}.`);
        },
        '!language': async () => {
            if (args.length < 1) return message.reply('Please specify a language (vi, en, ja).');

            const language = args[0];
            if (!['vi', 'en', 'ja'].includes(language)) {
                return message.reply('Invalid language. Choose between vi, en, or ja.');
            }

            ttsService.language = language;
            message.reply(`Language set to ${language}.`);
        },
        '!stk': async () => {
            message.reply('Bank account: 0372406980 MB BANK');
        },
        '!help': async () => {
            const helpMessage = `
                !tts <text> - Converts text to speech
                !adj <speed> - Adjusts speech speed (0.5 - 5)
                !language <language> - Adjusts speech language (vi, en, ja)
                !play <url> - Plays a YouTube video
                !skip - Skips the current song
                !stop - Stops the current song
                !repeat - Toggles repeat mode
                !stk - Displays bank account number
                !help - Displays this help message
                !exit - Exits the bot
            `;
            message.reply(helpMessage);
        },
        '!exit': async () => {
            message.reply('Goodbye!');
            process.exit(0);
        },
        '!qr': async () => {
            const imagePath = path.join(__dirname, 'images', 'qr.jpg');
            try {
                await message.reply({
                    files: [imagePath]
                });
                console.log('QR code sent!');
            } catch (error) {
                console.error('Error sending image:', error);
                message.reply('Error sending QR code.');
            }
        },
        '!weather': async () => {
            try {
                const response = await axios.get('https://freemeteo.vn/Services/Charts/Point?LanguageID=36&pointid=1580101&period=2&day=Today');
                const data = response.data;
                const { Name, Values, XAxis, Unit } = data;

                let weatherMessage = `Weather for ${Name}:\n`;
                for (let i = 0; i < Values.length; i++) {
                    const time = XAxis[i].replace(/<[^>]+>/g, '');
                    weatherMessage += `${time}: ${Values[i]}${Unit}\n`;
                }

                message.reply(weatherMessage);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                message.reply('kao bị lỗi rồi.');
            }
        }
    };

    if (commandHandlers[command]) {
        await commandHandlers[command]();
    }
});

async function processQueue() {
    if (textQueue.length === 0 || ttsService.isSpeaking) return;

    const { text, voiceChannel } = textQueue.shift();
    ttsService.isSpeaking = true;

    try {
        await ttsService.handleTTS(text, voiceChannel);
    } finally {
        ttsService.isSpeaking = false;
        if (textQueue.length > 0) processQueue();
    }
}

client.login(token);
