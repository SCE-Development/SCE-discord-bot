const { prefix } = require('../../../config.json');

const Command = require('../Command');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');

const audioManager = require('../../util/audioManager');

module.exports = new Command({
  name: 'skip',
  description: 'Skip song in queue',
  aliases: ['skip'],
  example: `${prefix}skip`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    let player = audioManager.getAudioPlayer();

    if (player.state.status === AudioPlayerStatus.Playing) {
      audioManager.removeFromQueue();
    }
  },
});
