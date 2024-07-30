const { prefix } = require('../../../config.json');

const Command = require('../Command');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');

const MusicSingleton = require('../../util/MusicSingleton');
const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'skip',
  description: 'Skip song in queue',
  aliases: ['skip'],
  example: `${prefix}skip`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    musicHandler.skip(message);
  },
});
