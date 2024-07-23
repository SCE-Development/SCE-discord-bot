const { prefix } = require('../../../config.json');
const {
  joinVoiceChannel,
  createAudioPlayer,
  AudioPlayerStatus
} = require('@discordjs/voice');

const Command = require('../Command');
const audioManager = require('../../util/audioManager');

module.exports = new Command({
  name: 'play',
  description: 'Stream the URL/the most relevant result return from Youtube',
  aliases: ['play'],
  example: `${prefix}play <url/song title>`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message, args) => {
    const query = args.slice(1).join(' ');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to be in a voice channel to play music!');
    }

    let player = audioManager.getAudioPlayer();

    if (player && player.state.status === AudioPlayerStatus.Playing) {
      
      audioManager.addToQueue({ message, query});
      return message.reply('Song added to the queue!');
    }

    await audioManager.playSong(message, query);
  } 
});
