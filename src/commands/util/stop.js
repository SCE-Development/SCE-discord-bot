const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'stop',
  description: 'Stop, clear queues and disconnect the bot',
  aliases: ['stop'],
  example: `${prefix}stop`,
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    if (message.member.voice.channel) {
      if (args[0] === undefined) {
        musicHandler.stop();
      } else {
        message.reply('Invalid Option');
      }
    } else {
      message.reply('Please join voice channel first!');
    }
  },
});
