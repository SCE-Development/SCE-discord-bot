const { prefix } = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'queue',
  description: 'Lists current and upcoming songs in the queue',
  aliases: ['queue'],
  example: `${prefix}queue`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    musicHandler.getQueue(message);
  },
});
