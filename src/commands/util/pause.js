const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'pause',
  description: 'Pause the track',
  aliases: ['pause'],
  example: `${prefix}pause`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    musicHandler.pause(message);
  },
});
