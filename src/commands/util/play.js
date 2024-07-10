const { prefix } = require('../../../config.json');
const play = require('play-dl');
const ytdl = require('@distube/ytdl-core');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const Command = require('../Command');
const audioManager = require('../../util/audioManager');


module.exports = new Command({
  name: 'play',
  description: 'Stream the URL/the most relevant result return from Youtube',
  aliases: ['play'],
  example: `${prefix}play <url/song title>`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message, args) => {
    const query = args.slice(1).join(' ');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to be in a voice channel to play music!');
    }

    let player = audioManager.getAudioPlayer();

    if (!player) {
      player = createAudioPlayer();
      audioManager.setAudioPlayer(player);
    }
    else if (player.state.status === AudioPlayerStatus.Playing) {
      return message.reply('An audio track is already playing!');
    }
    else if (player.state.status === AudioPlayerStatus.Paused && !query) {
      player.unpause();
      return message.reply('Unpaused!');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    audioManager.setConnection(connection);

    let stream;
    console.log(`searching for ${query}`);
    const searchResults = await play.search(query, { limit: 1 });
    if (searchResults.length === 0) {
      return message.reply('No results were found!');
    }
    const url = searchResults[0].url;
    stream = ytdl(url, { filter: 'audioonly' });
    console.log(`search result url: ${url}`);
    
    const resource = createAudioResource(stream);
    audioManager.setAudioPlayer(player);

    player.play(resource);
    connection.subscribe(player);

    player.on('idle', () => {
      connection.destroy();
    });

    audioManager.setInfo(await ytdl.getInfo(url));
    audioManager.setUrl(url);

    const vidInfo = audioManager.getInfo();


    const embedPlaying = new EmbedBuilder()
      .setColor('#1DB954')
      .setTitle(vidInfo.videoDetails.title)
      .setAuthor({ name: 'Now playing!' })
      .setURL(url)
      .setThumbnail(vidInfo.videoDetails.thumbnails[2].url)
      .setFooter(
        {
          text: `Requested by ${message.author.username}`,
          iconURL: `${message.author.displayAvatarURL()}`
        }
      );

    await message.reply({embeds: [embedPlaying]});

  } 
});
