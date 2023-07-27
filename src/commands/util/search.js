const {
  prefix
} = require('../../../config.json');

const play = require('play-dl');

const Command = require('../Command');
const { EmbedBuilder } = require('discord.js');

const MusicSingleton = require('../../util/MusicSingleton');
const musicHandler = new MusicSingleton();

module.exports = new Command({
  name: 'search',
  description: 'Search and play music from Youtube',
  aliases: ['search'],
  example: 's!search <keywords>',
  permissions: 'member',
  category: 'information',
  disabled: false,
  execute: async (message, args) => {
    if (message.member.voice.channel) {
      if (args.length > 0) {
        let ytInfo = await play.search(args.join(' '), { limit: 5 });
        if (ytInfo.length > 0) {
          let items = ytInfo.map((song, index) => {
            return `\`${index + 1}: ${song.title}\``;
          });
          items.push('\n0: Cancel');
          // ask if which track user wish to play
          // embedded
          const embeddedSearch = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'Please select the following results' })
            .setDescription(items.join('\n'));

          message.channel.send({ embeds: [embeddedSearch] });
          const msgFilter = (m) => m.author.id === message.author.id;
          const collected = await message.channel.awaitMessages(
            { filter: msgFilter, max: 1 }
          );
          const userInput = collected.values().next().value.content;
          // play the decided option
          if (userInput > 0 && userInput <= 5) {
            musicHandler.playOrAddYouTubeUrlToQueue(
              message, ytInfo[userInput - 1].url
            );
          } else if (userInput === '0') {
            message.reply('Cancelled');
          } else {
            message.reply('Invalid choice');
          }

        }

      }
      else {
        message.reply(`Usage: 
          \`${prefix}search <query>: Returns top 5\`
          \`${prefix}play <title/url>: Plays first song from search/ url\`
          \`${prefix}stream stop/skip: Modifies song playing\`
          
          `);
      }

    } else {
      message.reply('Please join voice channel first!');
    }

  }
});
