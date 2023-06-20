// see https://discord.js.org/#/docs/discord.js/12.5.3/topics/voice

/**
 * stupid hacks:
 * docker exec -it bot /bin/sh
 * npm update
 * npm i libsodium-wrappers
 */

const {
  prefix
} = require('../../../config.json');


const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  AudioPlayerStatus,

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
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(url);
};
// audio object
let audio = {
  queue: [],
  player: createAudioPlayer(),
};

// idle state
// bot dc when finish playing
audio.player.on(AudioPlayerStatus.Idle, async () => {
  console.log('idle')
  isBotOn = false;
  const connection = getVoiceConnection(
    audio.message.guild.voiceStates.guild.id
  );
  connection.destroy();
});

audio.player.on(AudioPlayerStatus.Playing, async () => {
  console.log('playing')
})

audio.player.on(AudioPlayerStatus.AutoPaused, async () => {
  console.log('autopaused')
})
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
        try {
          audio.player.play(
            createAudioResource(await ytdl(url, { filter: 'audioonly' }))
          );
        } catch (_) {
          message.reply(
            `Sorry! Unable to stream "${args[0]}", please try a different url.`
          );
        }
      }
      else {
        if (args[0] === undefined)
          message.reply(`Usage: 
          \`${prefix}stream <url>: Play a track\``);
        else {
          if (args[0] === 'stop') {
            audio.player.stop();
          }
          else {
            message.reply(`${args[0]} is not a valid YouTube / SoundCloud URL`);
          }
        }

      }

    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});
