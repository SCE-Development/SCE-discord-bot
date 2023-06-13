// see https://discord.js.org/#/docs/discord.js/12.5.3/topics/voice

/**
 * stupid hacks:
 * docker exec -it bot /bin/sh
 * npm update
 * npm i libsodium-wrappers
 */

const {
  joinVoiceChannel,
  entersState, 
  createAudioPlayer,
  createAudioResource,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

const Command = require('../Command');

function downloadAndPlayUrl(url, connection) {
  console.log(url, Object.keys(connection))
  connection.play(ytdl(url, { filter: 'audioonly' }))
    .on('error', (e) => { console.log(e) })
    .on('end', () => {
      console.log('left channel');
      connection.channel.leave();
    })
    .on('debug', console.log)
}

module.exports = new Command({
  name: 'stream',
  description: 'imagine kneeling to a corporation',
  aliases: ['stream'],
  example: 's!stream',
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    console.log(args)
    const url = args[0]
    const cacheKey = Object.keys(message.guild.voiceStates)[0]
    const channelId = message.guild.voiceStates[cacheKey].channelID
    const guildId = message.guild.voiceStates.guild.id
    console.log('message.member.voice.channel')
    if (message.member.voice.channel) {
      const voiceChannel = message.member.voice.channel;
      console.log({voiceChannel})
      let audioPlayer = createAudioPlayer();
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    }).subscribe(audioPlayer);
    audioPlayer.play(createAudioResource(await ytdl(url, { filter: 'audioonly' })))
      // connection.channel.leave();
      // return

    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});