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

async function playSong(message, query) {
  let player = audioManager.getAudioPlayer();

  if (!player) {
    player = createAudioPlayer();
    audioManager.setAudioPlayer(player);
  }

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  audioManager.setConnection(connection);

  let url;

  if (ytdl.validateURL(query)) {
    url = query;
    console.log("raw URL provided!")
  }
  else {
    console.log(`searching for ${query}`);
    const searchResults = await play.search(query, { limit: 1 });
    if (searchResults.length === 0) {
    return message.reply('No results were found!');
    }
    url = searchResults[0].url;
    console.log(`search result url: ${url}`);
  }
  
  const stream = ytdl(url, { filter: 'audioonly' });
  
  const resource = createAudioResource(stream);
  player.play(resource);
  connection.subscribe(player);

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

  player.on('idle', () => {
    const nextSong = audioManager.removeFromQueue();
    if (nextSong) {
      playSong(message, nextSong.query);
    } else {
      connection.destroy();
    }
  });
}

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

    if (player && player.state.status === AudioPlayerStatus.Playing) {
      audioManager.addToQueue({ query, author: message.author });
      return message.reply('Song added to the queue!');
    }

    await playSong(message, query);
  } 
});
