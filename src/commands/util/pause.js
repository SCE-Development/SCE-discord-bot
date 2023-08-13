const { prefix } = require('../../../config.json');
const Command = require('../Command');
const MusicSingleton = require('../../util/MusicSingleton');
const { CommandCategory } = require('../../util/enums');


const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'pause',
  description: 'Pause the track',
  aliases: ['pause'],
  example: `${prefix}pause`,
  permissions: 'member',
  category: CommandCategory.MUSIC,
  disabled: false,
  execute: async (message) => {
    musicHandler.pause(message);
  },
});
