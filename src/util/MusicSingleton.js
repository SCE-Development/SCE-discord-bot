const {
  createAudioPlayer,
  joinVoiceChannel,
  AudioPlayerStatus,
  getVoiceConnection,
  createAudioResource,
} = require('@discordjs/voice');
// at the top of your file
const { EmbedBuilder } = require('discord.js');

const ytdl = require('ytdl-core');
const play = require('play-dl');

// see https://stackoverflow.com/a/59626464
class MusicSingleton {
  constructor() {
    if (MusicSingleton._instance) {
      return MusicSingleton._instance;
    }
    MusicSingleton._instance = this;

    this._currentMessage = null;
    this.upcoming = [];
    this.history = [];
    this.botWasKicked = false;
    this.audioPlayer = createAudioPlayer();
    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.playNextUpcomingUrl(this);

    }
    );
    this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
      if (this.botWasKicked) {
        return;
      }
      this.announceNowPlaying(this);

    }
    );
    this.audioPlayer.on(AudioPlayerStatus.AutoPaused, async () => {
      // clear queues and stop the streaming
      this.botWasKicked = true;
      this.stop();
      this.setIsBotConnectedToChannel(false);
    });
    this.audioPlayer.on('error', console.error);
  }

  async announceNowPlaying(originalThis) {
    const { metadata } = originalThis.history[originalThis.history.length - 1];
    const embeddedSong = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(metadata.title)
      .setURL(metadata.video_url)
      .setAuthor({ name: 'Now playing' })
      .setThumbnail(metadata.thumbnails[2].url)
      .setFooter(
        {
          text: `Requested by ${this._currentMessage.author.username}`,
          iconURL: `${this._currentMessage.author.displayAvatarURL()}`
        }
      );
    originalThis._currentMessage.channel.send({ embeds: [embeddedSong] });
  }

  async playNextUpcomingUrl(originalThis) {
    if (originalThis.upcoming.length) {
      const { url: latestTrack, metadata } = originalThis.upcoming.shift();
      originalThis.history.push({ url: latestTrack, metadata });
      let stream = await play.stream(latestTrack);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      originalThis.audioPlayer.play(resource);
    }
    else if (this.botWasKicked) {
      // when the bot is kicked from a channel, the next time it plays a song,
      // the state first goes to idle. we handle this case here by
      // playing the next song instead of disconnecting the bot
      this.botWasKicked = false;
    } else {
      const connection = getVoiceConnection(
        originalThis._currentMessage.guild.voiceStates.guild.id
      );
      originalThis._isBotConnectedToChannel = false;
      connection.destroy();
      const embeddedDestroy = new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: 'I\'m disconnected from the channel' });
      this._currentMessage.channel.send({ embeds: [embeddedDestroy] });

    }
  }

  isBotConnectedToChannel() {
    return this._isBotConnectedToChannel;
  }

  setIsBotConnectedToChannel(value) {
    this._isBotConnectedToChannel = value;
  }

  skip(message) {
    if (!message.member.voice.channel) {
      return message.reply('Please join voice channel first!');
    }
    if (this.isBotConnectedToChannel()) {
      if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
        // we stop the audio player here so the state becomes idle
        // once idle, the next song will play
        this.audioPlayer.stop();
      } else {
        message.reply('There is no song to skip!');
      }
    } else {
      // bot is not on
      message.reply('The bot is not connected to a voice channel!');
    }
  }

  stop(message) {
    if (!message.member.voice.channel) {
      return message.reply('Please join voice channel first!');
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
      message.reply('Bot is already stopped.');
      return false;
    }
    this.upcoming = [];
    this.history = [];
    this.audioPlayer.stop();
    const embeddedStop = new EmbedBuilder()
      .setColor(0x0099FF)
      .setAuthor({ name: 'The bot is stopped' })
      .setDescription('Clearing queues... Disconnecting')
      .setFooter(
        {
          text: `Requested by ${this._currentMessage.author.username}`,
          iconURL: `${this._currentMessage.author.displayAvatarURL()}`
        }
      );
    this._currentMessage.channel.send({ embeds: [embeddedStop] });
  }

  pause(message) {
    if (!message.member.voice.channel) {
      message.reply('You need to join a voice channel first!');
      return false;
    }
    if (this.audioPlayer.state.status !== AudioPlayerStatus.Paused) {
      this.audioPlayer.pause();
    }
    const { metadata } = this.history[this.history.length - 1];
    const embeddedPause = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(metadata.title)
      .setAuthor({ name: 'Paused' })
      .setURL(metadata.video_url)
      .setThumbnail(metadata.thumbnails[2].url)
      .setFooter(
        {
          text: `Requested by ${this._currentMessage.author.username}`,
          iconURL: `${this._currentMessage.author.displayAvatarURL()}`
        }
      );
    message.channel.send({ embeds: [embeddedPause] });
  }

  resume(message) {
    if (!message.member.voice.channel) {
      return message.reply('Please join voice channel first!');
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
    } else {
      // the above will call announceNowPlaying implicitly, so we put the
      // below call in an else to avoid showing the user what's playing twice
      this.announceNowPlaying(this);
    }
  }

  // Assumes sent url is valid YouTube URL
  async playOrAddYouTubeUrlToQueue(message, url) {
    try {
      const { videoDetails } = await ytdl.getInfo(url);
      this._currentMessage = message;

      if (!message.member.voice.channel) {
        message.reply('You need to join a voice channel first!');
        return false;
      }

      if (!this._isBotConnectedToChannel) {
        const voiceChannel = message.member.voice.channel;
        this.setIsBotConnectedToChannel(true);
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        }).subscribe(this.audioPlayer);
      }
      const isInPlayingState =
        this.audioPlayer.state.status === AudioPlayerStatus.Playing;
      if (isInPlayingState) {
        this.upcoming.push({ url, metadata: videoDetails });

        const embeddedQueue = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(videoDetails.title)
          .setURL(videoDetails.video_url)
          .setAuthor({ name: 'Added Track' })
          .addFields(
            {
              name: 'Position in upcoming',
              value: `${this.upcoming.length}`, inline: true
            },
            {
              name: 'Position in queue',
              value: `${this.upcoming.length + this.history.length}`,
              inline: true
            },
          )
          .setThumbnail(videoDetails.thumbnails[2].url)
          .setTimestamp()
          .setFooter(
            {
              text: `Requested by ${message.author.username}`,
              iconURL: `${message.author.displayAvatarURL()}`
            });
        message.channel.send({ embeds: [embeddedQueue] });
      } else {
        this.history.push({ url, metadata: videoDetails });
        const stream = await play.stream(url);
        this.audioPlayer.play(
          createAudioResource(stream.stream, { inputType: stream.type })
        );

      }
      return true;
    } catch (e) {
      console.error('couldnt play song:', e);
      return false;
    }
  }
}

module.exports = MusicSingleton;
