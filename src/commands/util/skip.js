const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'skip',
  description: 'Skip song in queue',
  aliases: ['skip'],
  example: `${prefix}skip`,
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    if (message.member.voice.channel) {
      if (args[0] === undefined) {
        musicHandler.skip(message);
      } else {
        message.reply('Invalid Option');
      }
    } else {
      message.reply('Please join voice channel first!');
    }
  },
});
