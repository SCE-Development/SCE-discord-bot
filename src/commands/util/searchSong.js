const { prefix } = require('../../../config.json');

const Command = require('../Command');

const { MusicSingleton } = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'searchsong',
  description: 'Search and play a song',
  aliases: ['searchsong'],
  example: `${prefix}searchsong`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message, args) => {
    const songName = args.join(' ');
    console.log(songName);
    musicHandler.searchSong(message, songName);
},
});
