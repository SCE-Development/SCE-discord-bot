const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'unpause',
  description: 'Unpause the track',
  aliases: ['unpause'],
  example: `${prefix}unpause`,
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    if (message.member.voice.channel) {
      if (args[0] === undefined) {
        musicHandler.pause(message, 2);
      } else {
        message.reply('Invalid Option');
      }
    } else {
      message.reply('Please join voice channel first!');
    }
  },
});
