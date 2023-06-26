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

// audio object
let audio = {
  queue: [],
  player: createAudioPlayer(),
};

// get next audio resource to play
// create new AudioResource for audio to play
const getNextResource = async (url) => {
  return createAudioResource((await ytdl(url, { filter: 'audioonly' })));
};

// idle state
// bot dc when finish playing
audio.player.on(AudioPlayerStatus.Idle, async () => {
  if (audio.queue.length > 0) {
    audio.player.play(await getNextResource(audio.queue[0]));
  }
  else {
    isBotOn = false;
    const connection = getVoiceConnection(
      audio.message.guild.voiceStates.guild.id
    );
    connection.destroy();
  }
});

// playing state
// handle Playing state
audio.player.on(AudioPlayerStatus.Playing, async () => {

  // get music's info
  const { videoDetails: jsonData } = await ytdl.getInfo(audio.queue[0]);
  audio.queue.splice(0, 1);
  audio.message.reply(`Now playing \`${jsonData.title}\``);
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
    // const guildId = message.guild.voiceStates.guild.id;
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
      if (ytdl.validateURL(url)) {
        try {
          audio.queue.push(url);
          if (audio.player.state.status === AudioPlayerStatus.Playing) {
            const { videoDetails } = await ytdl.getInfo(url);
            message.reply(`Added track ${videoDetails.title}`);
          }
          else {
            audio.player.play(
              createAudioResource(await ytdl(url, { filter: 'audioonly' }))
            );

          }
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
          if (args[0] === 'skip') {
            audio.player.stop();
          }
          else if (args[0] === 'stop') {
            audio.player.stop();
            audio.queue = [];
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
