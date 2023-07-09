const {
  prefix
} = require('../../../config.json');
const { AudioPlayerStatus } = require('@discordjs/voice');

const Command = require('../Command');

let { audio, getIsBotOn } = require('./audio');

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
        if (getIsBotOn()) {
          if (audio.player.state.status === AudioPlayerStatus.Playing) {
            audio.player.stop();
          } else {
            message.reply('There is no song to skip!');
          }
        }
        else {
          // bot is not on
          message.reply('The bot is offline!');
        }
      } else if (args[0] === 'stop') {
        audio.upcoming = [];
        audio.history = [];
        audio.player.stop();
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
