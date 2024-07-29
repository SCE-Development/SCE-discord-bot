const { prefix } = require('../../../config.json');

const Command = require('../Command');

const { MusicSingleton } = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'getqueue',
  description: 'Print all songs in queue',
  aliases: ['getqueue'],
  example: `${prefix}getqueue`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    musicHandler.getQueue(message);
  },
});
