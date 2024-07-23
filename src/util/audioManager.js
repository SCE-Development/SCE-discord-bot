const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const play = require('play-dl');
const { EmbedBuilder } = require('discord.js');

let audioPlayer = null;
let connection = null;
let videoInfo = null;
let vidUrl = null;
let queue = [];

const createEmbedMessage = (videoInfo, url, footerText) => {
  return new EmbedBuilder()
    .setColor('#1DB954')
    .setTitle(videoInfo.videoDetails.title)
    .setAuthor({ name: 'Added to queue!' })
    .setURL(url)
    .setThumbnail(videoInfo.videoDetails.thumbnails[2].url)
    .setFooter({
      text: footerText,
      iconURL: videoInfo.videoDetails.author.thumbnails[0].url,
    });
};

async function playSong(message, query) {

  if (!audioPlayer) {
    audioPlayer = createAudioPlayer();
  }

  if (!connection) {
    connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
  }

  let url;

  if (ytdl.validateURL(query)) {
    url = query;
    console.log("URL detected!")
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

  audioPlayer.play(resource);
  connection.subscribe(audioPlayer);

  videoInfo = await ytdl.getInfo(url);
  vidUrl = url

  const embedPlaying = new EmbedBuilder()
    .setColor('#1DB954')
    .setTitle(videoInfo.videoDetails.title)
    .setAuthor({ name: 'Now playing!' })
    .setURL(url)
    .setThumbnail(videoInfo.videoDetails.thumbnails[2].url)
    .setFooter(
      {
        text: `Requested by ${message.author.username}`,
        iconURL: `${message.author.displayAvatarURL()}`
      }
    );

  await message.reply({embeds: [embedPlaying]});

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    const nextSong = queue.shift();
    if (nextSong) {
      playSong(nextSong.message, nextSong.query);
    } else {
      connection.destroy();
      audioPlayer = null;
      connection = null;
    }
  });
}


module.exports = {
  getAudioPlayer: () => audioPlayer,
  setAudioPlayer: (player) => {
    audioPlayer = player;
  },
  getConnection: () => connection,
  setConnection: (conn) => {
    connection = conn;
  },
  getInfo: () => videoInfo,
  setInfo: (info) => {
    videoInfo = info;
  },
  getUrl: () => vidUrl,
  setUrl: (url) => {
    vidUrl = url;
  },
  getQueue: () => queue,
  addToQueue: (item) => {
    queue.push(item);
  },
  removeFromQueue: () => {
    return queue.shift();
  },
  stop: () => {
    queue = [];
    connection.destroy();
    connection = null;
    audioPlayer = null;
  },
  playSong: playSong,
  createEmbedMessage: createEmbedMessage
};
