const { prefix } = require('../../../config.json');
const Command = require('../Command');
const MusicSingleton = require('../../util/MusicSingleton');
const { CommandCategory } = require('../../util/enums');


const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'skip',
  description: 'Skip song in queue',
  aliases: ['skip'],
  example: `${prefix}skip`,
  permissions: 'member',
  category: CommandCategory.MUSIC,
  disabled: false,
  execute: async (message) => {
    musicHandler.skip(message);
  },
});
