const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'resume',
  description: 'Resume the paused track',
  aliases: ['resume'],
  example: `${prefix}resume`,
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    if (args[0] === undefined) {
      musicHandler.resume(message);
    } else {
      message.reply('Invalid Option');
    }

  },
});
