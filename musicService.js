const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

let queue = [];
let connection;
let player;
let currentVoiceChannel;
let repeat = false;

function createPlayer() {
    player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    player.on(AudioPlayerStatus.Idle, () => {
        if (queue.length > 0) {
            if (repeat) queue.push(queue[0]); // move first to last
            queue.shift(); // remove current
            if (queue.length > 0) play(queue[0]); // play next
        }
    });

    player.on('error', err => {
        console.error('Error in audio player:', err);
        queue.shift();
        if (queue.length > 0) play(queue[0]);
    });
}

async function joinChannel(voiceChannel) {
    currentVoiceChannel = voiceChannel;

    connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    if (!player) createPlayer();

    connection.subscribe(player);
}

async function play(url) {
    const stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);
    player.play(resource);
}

async function addToQueue(voiceChannel, url) {
    if (!connection || connection.joinConfig.channelId !== voiceChannel.id) {
        await joinChannel(voiceChannel);
    }

    queue.push(url);
    if (player.state.status !== AudioPlayerStatus.Playing) {
        play(queue[0]);
    }
}

function skip() {
    player.stop(); // triggers .on('idle') to play next
}

function stop() {
    queue = [];
    if (player) player.stop();
    if (connection) connection.destroy();
    connection = null;
}

function toggleRepeat() {
    repeat = !repeat;
    return repeat;
}

module.exports = {
    addToQueue,
    skip,
    stop,
    toggleRepeat,
};
