// see https://discord.js.org/#/docs/discord.js/12.5.3/topics/voice

/**
 * stupid hacks:
 * docker exec -it bot /bin/sh
 * npm update
 * npm i libsodium-wrappers
 */
import fetch from 'node-fetch';

const {
  prefix
} = require('../../../config.json');


const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection

} = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

const Command = require('../Command');

// function downloadAndPlayUrl(url, connection) {
//   console.log(url, Object.keys(connection))
//   connection.play(ytdl(url, { filter: 'audioonly' }))
//     .on('error', (e) => { console.log(e) })
//     .on('end', () => {
//       console.log('left channel');
//       connection.channel.leave();
//     })
//     .on('debug', console.log)
// }

// check valid url
const isValidUrl = url => {
  let urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(url);
};


// create new AudioResource for audio to play
const getNextResource = async (url) => {
  return createAudioResource(await ytdl(url, { filter: 'audioonly' }));
};

// 
let audio = {
  queue: [],
  player: createAudioPlayer(),
};

// handle Playing state
audio.player.on(AudioPlayerStatus.Playing, async () => {
  const response = await fetch(`https://noembed.com/embed?dataType=json&url=${audio.queue[0]}`);
  const jsonData = await response.json();
  audio.queue.splice(0, 1);
  audio.message.reply(`Now playing ${jsonData.title}`);
});

// hanlde Idle state
// play the next song and pop the song being play from the queue
audio.player.on(AudioPlayerStatus.Idle, async () => {


  if (audio.queue.length > 0) {
    audio.player.play(await getNextResource(audio.queue[0]));
  }
});

// hanlde buffering state
audio.player.on(AudioPlayerStatus.Buffering, async () => {

});
// let audioPlayer = createAudioPlayer();
let isBotOn = false;
module.exports = new Command({
  name: 'stream',
  description: 'imagine kneeling to a corporation',
  aliases: ['stream'],
  example: 's!stream',
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    const url = args[0];
    // const cacheKey = Object.keys(message.guild.voiceStates)[0];
    // const channelId = message.guild.voiceStates[cacheKey].channelID;
    const guildId = message.guild.voiceStates.guild.id;
    const voiceChannel = message.member.voice.channel;
    audio.message = message;
    if (message.member.voice.channel) {
      if (!isBotOn) {
        isBotOn = true;
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        }).subscribe(audio.player);

      }
      // check if url is valid
      // would be better if can check playable url
      if (isValidUrl(url)) {
        if (audio.player.state.status === AudioPlayerStatus.Idle) {
          // if the bot is idle
          // simply play the song
          audio.player.play(createAudioResource(await ytdl(url, { filter: 'audioonly' })));
          audio.queue.push(url);
        } else if (audio.player.state.status === AudioPlayerStatus.Playing) {
          // if the bot is playing another song, add this song to queue 
          // then handle it on.('idle') on the above handlers
          audio.queue.push(url);
          message.reply('Added the song to queue');
        } else if (audio.player.state.status === AudioPlayerStatus.AutoPaused) {
          // handle when the bot disconnected (kick bot out of voice channel)
          // skip song
          audio.player.stop();
          // clear queues
          audio.queue = [];
          // play the song
          audio.player.play(createAudioResource(await ytdl(url, { filter: 'audioonly' })));
        } else {
          // buffering
          // idk if we should handle sthing here
          console.log('buffering state');
        }
      }
      else {
        if (url === 'pause') audio.player.pause();
        else if (url === 'skip') audio.player.stop();
        else if (url === 'resume') audio.player.unpause();
        else if (url === 'stop') {
          audio.player.stop();
          audio.queue = [];
          const connection = getVoiceConnection(guildId);
          connection.destroy();
        }
        else {
          message.reply(`Usage: 
          \`${prefix}stream <url>: Play a track\`
          \`${prefix}stream pause: Pause the track\`
          \`${prefix}stream resume: Resume the track\`
          \`${prefix}stream skip: Skip the track\`
          \`${prefix}stream stop: Stop the bot\``);
        }
      }
      // connection.channel.leave();
      // return

    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});
