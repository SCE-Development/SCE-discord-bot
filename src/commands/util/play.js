const { prefix } = require('../../../config.json');
const play = require('play-dl');
const ytdl = require('ytdl-core');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
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
    const query = args.join(' ');

    const YT_URL = 'https://www.youtube.com/watch?v=koWC_T6KxPs';
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to be in a voice channel to play music!');
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
    const player = createAudioPlayer();

    audioManager.setAudioPlayer(player)

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

    /* const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to be in a voice channel to play music!');
    }

    console.log(`Joining voice channel: ${voiceChannel.name}`);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('The bot has connected to the channel!');
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log('The bot has been disconnected from the channel!');
    });

    let stream;
    try {
      if (await play.yt_validate(query) === 'video') {
        console.log('valid youtube URL');
        stream = await play.stream(query);
      } else {
        console.log(`searching for ${query}`);
        const searchResults = await play.search(query, { limit: 1 });
        if (searchResults.length === 0) {
          return message.reply('No results were found!');
        }
        const url = searchResults[0].url;
        console.log(`search result url: ${url}`);
        stream = await play.stream(url);
      }
    } catch (error) {
      console.error('Error fetching stream:', error);
      return message.reply('There was an error fetching the stream.');
    }

    if (!stream || !stream.stream) {
      return message.reply('Failed to create stream.');
    }

    console.log('Stream data obtained:', stream);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    const player = createAudioPlayer();

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('The audio player is idle!');
      connection.destroy();
    });

    player.on('error', error => {
      console.error('Error playing audio:', error);
    });

    player.play(resource);
    connection.subscribe(player);

    await message.reply('Playing now!'); */
  } 
});
