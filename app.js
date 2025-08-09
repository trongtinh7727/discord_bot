const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const TTSService = require('./TTSService');

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



let globalSpeed = 1.3; // Default speed
const ttsService = new TTSService(globalSpeed);

const textQueue = [];
const MAX_TEXT_LENGTH = 2000; // Maximum length for each text
const MAX_QUEUE_SIZE = 50;

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

            if (textQueue.length >= MAX_QUEUE_SIZE) {
                return message.reply(`Queue full (>= ${MAX_QUEUE_SIZE}), wait a bit.`);
            }

            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.reply('You need to join a voice channel first.');

            textQueue.push({ text, voiceChannel });
            processQueue();
        },
        '!queue': async () => {
            if (textQueue.length === 0 && !ttsService.isSpeaking) return message.reply('Queue empty.');
            const lines = textQueue.slice(0, 10).map((item, i) => {
                const snippet = item.text.length > 40 ? item.text.slice(0, 37) + '...' : item.text;
                return `${i + 1}. ${snippet} (${item.user || 'unknown'})`;
            });
            message.reply(
                'Current: ' + (ttsService.isSpeaking ? 'Playing' : 'Idle') + '\n' +
                (lines.length ? lines.join('\n') : 'No pending items.') +
                (textQueue.length > 10 ? `\n...and ${textQueue.length - 10} more` : '')
            );
        },
        '!clearqueue': async () => {
            if (!isAdmin(message.member)) return message.reply('No permission.');
            textQueue.length = 0;
            message.reply('Queue cleared.');
        },
        '!remove': async () => {
            if (!isAdmin(message.member)) return message.reply('No permission.');
            if (args.length < 1) return message.reply('Usage: !remove <index>');
            const idx = parseInt(args[0], 10);
            if (isNaN(idx) || idx < 1 || idx > textQueue.length) return message.reply('Invalid index.');
            const removed = textQueue.splice(idx - 1, 1)[0];
            message.reply(`Removed: ${removed.text.slice(0, 50)}`);
        },
        '!ping': async () => {
            const sent = Date.now();
            const replyMsg = await message.reply('Pinging...');
            const latency = Date.now() - sent;
            let externalIP = 'n/a';
            try {
                const res = await axios.get('https://api.ipify.org?format=json', { timeout: 3000 });
                externalIP = res.data.ip;
            } catch { }
            const wsPing = Math.round(client.ws.ping);
            replyMsg.edit(`Pong! Latency: ${latency}ms | WS: ${wsPing}ms | Host IP: ${externalIP}`);
        },
        '!stats': async () => {
            message.reply(
                `Speed: ${ttsService.globalSpeed} | Lang: ${ttsService.language} | ` +
                `Queue: ${textQueue.length} | Speaking: ${ttsService.isSpeaking ? 'yes' : 'no'}`
            );
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
\`\`\`
!tts <text>         - Convert text to speech
!adj <speed>        - Set speed (0.5 - 5)
!language <vi|en|ja>- Set language
!queue              - Show queue
!stats              - Show status
!ping               - Latency & host IP
!clearqueue         - Clear queue (admin)
!remove <index>     - Remove queue item (admin)
!stk                - Bank info
!exit               - Stop bot (admin)
!help               - This help
\`\`\`
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
        await ttsService.handleTTS(text, voiceChannel); // Chờ phát xong mới tiếp tục
    } finally {
        ttsService.isSpeaking = false;
        if (textQueue.length > 0) processQueue();
    }
}

client.login(token);
