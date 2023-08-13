const { prefix } = require('../../../config.json');
const Command = require('../Command');
const MusicSingleton = require('../../util/MusicSingleton');
const { CommandCategory } = require('../../util/enums');


const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'stop',
  description: 'Stop, clear queues and disconnect the bot',
  aliases: ['stop'],
  example: `${prefix}stop`,
  permissions: 'member',
  category: CommandCategory.MUSIC,
  disabled: false,
  execute: async (message) => {
    musicHandler.stop(message);
  },
});
