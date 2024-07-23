const { prefix } = require('../../../config.json');

const Command = require('../Command');

const audioManager = require('../../util/audioManager');

const { EmbedBuilder } = require('discord.js');

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
    /* const player = audioManager.getAudioPlayer();

    if (!message.member.voice.channel) {
      return message.reply('Please join a voice channel first!');
    }

    if (!player) {
      return message.reply('There is nothing currently playing!');
    }

    const vidInfo = audioManager.getInfo();

    const embedPlaying = new EmbedBuilder()
      .setColor('#1DB954')
      .setTitle(vidInfo.videoDetails.title)
      .setAuthor({ name: 'Paused!' })
      .setURL(audioManager.getUrl())
      .setThumbnail(vidInfo.videoDetails.thumbnails[2].url)
      .setFooter(
        {
          text: `Requested by ${message.author.username}`,
          iconURL: `${message.author.displayAvatarURL()}`
        }
      );
    
    player.pause();

    await message.reply({embeds: [embedPlaying]}); */
    musicHandler.pause(message);


  },
});
