const {
  prefix
} = require('../../../config.json');

const {
  joinVoiceChannel,
  createAudioResource,
  AudioPlayerStatus,

} = require('@discordjs/voice');
const play = require('play-dl');

const Command = require('../Command');

let { audio, getIsBotOn, setIsBotOn } = require('./audio');
module.exports = new Command({
  name: 'search',
  description: 'imagine kneeling to a corporation',
  aliases: ['search'],
  example: 's!search',
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
          // ask if which track user wish to play
          message.channel.send('Please select the following results');
          message.channel.send(`${items.join('\n')}`);
          const msgFilter = (m) => m.author.id === message.author.id;
          const collected = await message.channel.awaitMessages(
            { filter: msgFilter, max: 1 }
          );
          const userInput = collected.values().next().value.content;
          // play the decided option
          if (userInput > 0 && userInput <= 5) {
            if (getIsBotOn()) {
              if (audio.player.state.status === AudioPlayerStatus.Playing) {
                audio.upcoming.push(ytInfo[userInput - 1].url);
                message.reply(`Added track \`${ytInfo[userInput - 1].title}\``);
              } else {
                audio.history.push(ytInfo[userInput - 1].url);
                let stream = await play.stream(ytInfo[userInput - 1].url);
                audio.player.play(
                  createAudioResource(stream.stream, { inputType: stream.type })
                );
              }
            }
            else {
              setIsBotOn(true);
              const voiceChannel = message.member.voice.channel;
              audio.message = message;
              joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
              }).subscribe(audio.player);

              audio.history.push(ytInfo[userInput - 1].url);
              let stream = await play.stream(ytInfo[userInput - 1].url);
              audio.player.play(
                createAudioResource(stream.stream, { inputType: stream.type })
              );
            }
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
