const {
  prefix
} = require('../../../config.json');

const Command = require('../Command');

const MusicSingleton = require('../../util/MusicSingleton');

const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'stream',
  description: 'imagine kneeling to a corporation',
  aliases: ['stream'],
  example: 's!stream',
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    if (message.member.voice.channel) {
      if (args[0] === 'skip') {
        musicHandler.skip(message);
      } else if (args[0] === 'stop') {
        musicHandler.stop();
      }
      else if (args[0] === undefined) {
        message.reply(`Usage: 
          \`${prefix}search <query>: Returns top 5\`
          \`${prefix}play <title/url>: Plays first song from search/ url\`
          \`${prefix}stream stop/skip: Modifies song playing\`
          
          `);
      } else {
        message.reply('Invalid Option');
      }
    } else {
      message.reply('Please join voice channel first!');
    }
  }
});
