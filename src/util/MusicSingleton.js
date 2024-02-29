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
    }
  }

  isBotConnectedToChannel() {
    return this._isBotConnectedToChannel;
  }

  setIsBotConnectedToChannel(value) {
    this._isBotConnectedToChannel = value;
  }

  disconnectBot() {
    this.upcoming = [];
    this.history = [];
    this.audioPlayer.stop();
  }

  skip(message) {
    if (!message.member.voice.channel) {
      return message.reply('Please join a voice channel first!');
    }
    if (this.isBotConnectedToChannel()) {
      if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
        // we stop the audio player here so the state becomes idle
        // once idle, the next song will play
        this.audioPlayer.stop();
      } else {
        message.reply('There are no songs to skip!');
      }
    } else {
      // bot is not on
      message.reply('The bot is not connected to a voice channel!');
    }
  }

  stop(message) {
    if (!message) return;
    if (!message.member.voice.channel) {
      return message.reply('Please join a voice channel first!');
    }


    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
      return false;
    }
    this.upcoming = [];
    this.history = [];
    this.audioPlayer.stop();
    const embeddedStop = new EmbedBuilder()
      .setColor(0x0099FF)
      .setAuthor({ name: 'The bot is stopped' })
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
      return message.reply('Please join a voice channel first!');
    }
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
    } else {
      // the above will call announceNowPlaying implicitly, so we put the
      // below call in an else to avoid showing the user what's playing twice
      this.announceNowPlaying(this);
    }
  }

  getQueue(message) {
    if (this.upcoming.length) {
      let queueTimeLength = 0;
      const songs = this.upcoming.map((song, index) => {
        queueTimeLength += parseInt(song.metadata.lengthSeconds);
        let songLengthMin = Math.floor(song.metadata.lengthSeconds / 60);
        songLengthMin =
          songLengthMin < 10 ? `0${songLengthMin}` : songLengthMin;
        let songLengthSec = song.metadata.lengthSeconds % 60;
        songLengthSec =
          songLengthSec < 10 ? `0${songLengthSec}` : songLengthSec;
        return (
          `\`[${index + 1}]\` 
          ${song.metadata.title} 
          \`[${songLengthMin}:${songLengthSec}]\``
        );
      });

      let queueTimeLengthMin = Math.floor(queueTimeLength / 60);
      queueTimeLengthMin =
        queueTimeLengthMin < 10 ? `0${queueTimeLengthMin}` : queueTimeLengthMin;
      let queueTimeLengthSec = queueTimeLength % 60;
      queueTimeLengthSec =
        queueTimeLengthSec < 10 ? `0${queueTimeLengthSec}` : queueTimeLengthSec;

      const embeddedQueue = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: 'Upcoming songs' })
        .setDescription(
          songs.join('\n') +
          '\n\n' +
          `There are **${this.upcoming.length}** tracks in queue with 
          a length of \`[${queueTimeLengthMin}:${queueTimeLengthSec}]\`.`,
        );
      message.channel.send({ embeds: [embeddedQueue] });
    } else {
      message.channel.send('Queue is empty!');
    }
  }

  // Assumes sent url is valid YouTube URL
  async playOrAddYouTubeUrlToQueue(message, url, repetitions = 1) {
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
        for (let i = 0; i < repetitions; i++) {
          this.upcoming.push({ url, metadata: videoDetails });
        }
        const embeddedQueue = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle(videoDetails.title)
          .setURL(videoDetails.video_url)
          .setAuthor({ name: 'Added Track' })
          .addFields(
            {
              name: 'Position in upcoming',
              value: `${repetitions === 1 ? 
                        this.upcoming.length : 
                        `${Number(this.upcoming.length - repetitions + 1)} - ${this.upcoming.length}`}`,
              inline: true,
            }
          )
          .setThumbnail(videoDetails.thumbnails[2].url)
          .setTimestamp()
          .setFooter(
            {
              text: `Requested by ${message.author.username}`,
              iconURL: `${message.author.displayAvatarURL()}`
            }
          );
        message.channel.send({ embeds: [embeddedQueue] });
      } else {
        this.history.push({ url, metadata: videoDetails });
        const stream = await play.stream(url);
        this.audioPlayer.play(
          createAudioResource(stream.stream, { inputType: stream.type })
        );

        if (repetitions > 1) {
          this.playOrAddYouTubeUrlToQueue(message, url, repetitions - 1);
        }
      }
      return true;
    } catch (e) {
      console.error('couldnt play song:', e);
      return false;
    }
  }
}

module.exports = MusicSingleton;
