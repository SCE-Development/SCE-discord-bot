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
  AudioPlayerStatus

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

// check valid url
// get it from https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
const isValidUrl = url => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(url);
}

const getNextResource = async (url) => {
  return createAudioResource(await ytdl(url, { filter: 'audioonly' }))
}

let audio = {
  queue: [],
  player: createAudioPlayer(),

}

audio.player.on(AudioPlayerStatus.Playing, async () => {
  console.log('The audio player has started playing!');
})
audio.player.on(AudioPlayerStatus.Idle, async () => {
  if (audio.queue.length > 0) {
    audio.player.play(await getNextResource(audio.queue[0]))
    audio.queue.splice(0, 1)
  }
})

audio.player.on(AudioPlayerStatus.Buffering, async () => {

  console.log('buffering', audio.queue)
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
    const url = args[0]
    const cacheKey = Object.keys(message.guild.voiceStates)[0]
    const channelId = message.guild.voiceStates[cacheKey].channelID
    const guildId = message.guild.voiceStates.guild.id
    const voiceChannel = message.member.voice.channel;

    if (message.member.voice.channel) {
      if (!isBotOn) {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        }).subscribe(audio.player);
      }
      if (isValidUrl(url)) {
        if (audio.player.state.status === AudioPlayerStatus.Idle) {
          audio.player.play(createAudioResource(await ytdl(url, { filter: 'audioonly' })))
        } else {
          audio.queue.push(url)
          message.reply("Added the song to queue")
        }
      }
      else {
        if (url === 'pause') audio.player.pause()
        else if (url === 'skip') audio.player.stop()
        else if (url === 'resume') audio.player.unpause()
        else {
          message.reply("Invalid URL || Option")
        }
      }
      // connection.channel.leave();
      // return

    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});