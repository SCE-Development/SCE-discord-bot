const { EmbedBuilder } = require('discord.js');
const Distube = require('distube');
const { YouTubePlugin } = require('@distube/youtube');

class MusicSingleton {
  constructor() {
    if (MusicSingleton._instance) {
      return MusicSingleton._instance;
    }
    MusicSingleton._instance = this;
    this.distube = null;
    this.textChannel = null; // Store textchannel where command was called to use for listeners
  }

  initializeDistube(client) {
    if (this.distube) {
        throw new Error('Distube is already initialized');
    }
    const youtubePlugin = new YouTubePlugin({
        cookies: [
          // ...
        ],
      });
      
    this.distube = new Distube.default(client, {
        plugins: [
        //   new YtDlpPlugin({
        //     update: false,
        //   }),
          youtubePlugin,
        ],
    });
}

  getInstance() {
    if (!MusicSingleton._instance) {
        MusicSingleton._instance = new MusicSingleton();
    }
    return MusicSingleton._instance;
  }

  setupListeners() {
    this.distube.on('addSong', (queue, song) => {
        if (this.textChannel) {
            this.textChannel.send('A new song was added to the queue');
        }
    });
    this.distube.once('playSong', (queue, song) => {
        this.textChannel.send(`Now playing: ${song.name}`);
    });
    this.distube.once('finish', () => {
        this.textChannel.send(`Queue is empty.`);
    });
    this.distube.once('empty', () => {
        this.textChannel.send(`Voice channel empty. Disconnecting.`);
    });
    // this.distube.on('error', (textChannel, error) => {
    //     textChannel.channel.send('Error.');
    // })
  }
  // async announceNowPlaying(originalThis) {
  //   if (originalThis.alreadyAnnouncedCurrentVideo) {
  //     return;
  //   }
  //   originalThis.alreadyAnnouncedCurrentVideo = true;
  //   const embeddedSong = new EmbedBuilder()
  //     .setColor(0x0099FF)
  //     .setTitle(originalThis.nowPlayingMetadata.title)
  //     .setURL(originalThis.nowPlayingMetadata.video_url)
  //     .setAuthor({ name: 'Now playing' })
  //     .setThumbnail(originalThis.nowPlayingMetadata.thumbnails[2].url)
  //     .setFooter(
  //       {
  //         text: `Requested by ${this._currentMessage.author.username}`,
  //         iconURL: `${this._currentMessage.author.displayAvatarURL()}`
  //       }
  //     );
  //   originalThis._currentMessage.channel.send({ embeds: [embeddedSong] });
  // }

  // async playNextUpcomingUrl(originalThis) {
  //   if (originalThis.upcoming.length) {
  //     const { url: latestTrack, metadata } = originalThis.upcoming[0];
  //     metadata.repetitions -= 1;
  //     if (metadata.repetitions === 0) {
  //       originalThis.upcoming.shift();
  //     }
  //     this.alreadyAnnouncedCurrentVideo = this.nowPlayingMetadata && 
  //       this.nowPlayingMetadata.video_url === metadata.video_url;
  //     this.nowPlayingMetadata = metadata;
  //     let stream = await play.stream(latestTrack);
  //     const resource = createAudioResource(stream.stream, {
  //       inputType: stream.type,
  //     });
  //     originalThis.audioPlayer.play(resource);
  //   }
  //   else if (this.botWasKicked) {
  //     // when the bot is kicked from a channel, the next time it plays a song,
  //     // the state first goes to idle. we handle this case here by
  //     // playing the next song instead of disconnecting the bot
  //     this.botWasKicked = false;
  //   } else {
  //     const connection = getVoiceConnection(
  //       originalThis._currentMessage.guild.voiceStates.guild.id
  //     );
  //     originalThis._isBotConnectedToChannel = false;
  //     connection.destroy();
  //   }
  // }

  play(message, url) {
    if (!message.member.voice.channel) {
        return message.reply('Please join a voice channel first!');
    }
    const voiceChannel = message.member.voice.channel;
    this.textChannel = message.channel;
    try {
        if (voiceChannel) {
            this.distube.play(voiceChannel, url);
        }
    } catch (error) {
        console.error('Error playing the song:', error);
        message.channel.send('Error playing the song.');
    }
  }

  searchSong(message, songName) {
    if (!message.member.voice.channel) {
        return message.reply('Please join a voice channel first!');
    }
    const voiceChannel = message.member.voice.channel;
    this.textChannel = message.channel;
    try {
        if (voiceChannel) {
            this.distube.play(voiceChannel, songName);
        }
    } catch (error) {
        console.error('Error playing the song:', error);
        message.channel.send('Error playing the song.');
    }
  }

  async skip(message) {
    if (!message.member.voice.channel) {
        return message.reply('Please join a voice channel first!');
    }
    try {
        await this.distube.skip(message);
        return message.reply('Skipping the current song');
    } catch(error) {
        if (error instanceof DisTubeError && error.errorCode === 'NO_UP_NEXT') {
            console.error('No up next song to skip to.');
            return message.reply('There is no up next song to skip to.');
        } else {
            console.error('Error while skipping the song:', error);
            return message.reply('An error occurred while trying to skip the song.');
        }
    }
  }

  // stop(message) {
  //   if (!message) return;
  //   if (!message.member.voice.channel) {
  //     return message.reply('Please join a voice channel first!');
  //   }


  //   if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
  //     return false;
  //   }
  //   this.upcoming = [];
  //   this.nowPlayingMetadata = {};
  //   this.audioPlayer.stop();
  //   const embeddedStop = new EmbedBuilder()
  //     .setColor(0x0099FF)
  //     .setAuthor({ name: 'The bot is stopped' })
  //     .setFooter(
  //       {
  //         text: `Requested by ${this._currentMessage.author.username}`,
  //         iconURL: `${this._currentMessage.author.displayAvatarURL()}`
  //       }
  //     );
  //   this._currentMessage.channel.send({ embeds: [embeddedStop] });
  // }

  stop(message) { // maybe replace message.member.voice.channel with voicechannel class variable
    if (!message.member.voice.channel) {
        return message.reply('Please join a voice channel first!');
    }
    try {
        this.distube.stop(message);
        message.channel.send('Stopped the music.');
        this.distube.voices.get(message)?.leave();
    } catch (error) {
          console.error('Error stopping the music:', error);
          message.channel.send('Error stopping the music.');
    }
  }

  // pause(message) {
  //   if (!message.member.voice.channel) {
  //     message.reply('You need to join a voice channel first!');
  //     return false;
  //   }
  //   if (this.audioPlayer.state.status !== AudioPlayerStatus.Paused) {
  //     this.audioPlayer.pause();
  //   }
  //   const embeddedPause = new EmbedBuilder()
  //     .setColor(0x0099FF)
  //     .setTitle(this.nowPlayingMetadata.title)
  //     .setAuthor({ name: 'Paused' })
  //     .setURL(this.nowPlayingMetadata.video_url)
  //     .setThumbnail(this.nowPlayingMetadata.thumbnails[2].url)
  //     .setFooter(
  //       {
  //         text: `Requested by ${this._currentMessage.author.username}`,
  //         iconURL: `${this._currentMessage.author.displayAvatarURL()}`
  //       }
  //     );
  //   message.channel.send({ embeds: [embeddedPause] });
  // }

  resume(message) {
    if (!message.member.voice.channel) {
        return message.reply('Please join a voice channel first!');
    }
    try {
        this.distube.resume(message);
        message.channel.send('Resumed the music.');
    } catch (error) {
          console.error('Error resuming the music:', error);
          message.channel.send('Error resuming the music.');
    }
  }

  getQueue(message) {
    if (!message.member.voice.channel) {
        return message.reply('Please join a voice channel first!');
    }
    try {
        const queue = this.distube.getQueue(message);
        if (!queue) {
          return message.channel.send('Queue is empty.');
        }
        const currentSong = queue.songs[0];
        const upcomingSongs = queue.songs.slice(1);

        let queueMessage = `**Now Playing:** ${currentSong.name}\n`;

        upcomingSongs.forEach((song, index) => {
            queueMessage += `**${index + 1}.** ${song.name}\n`;
        });

        message.channel.send(queueMessage);
    } catch (error) {
        console.error('Error fetching the queue:', error);
        message.channel.send('Error fetching the queue.');
    }
}

  // Assumes sent url is valid YouTube URL
  // async playOrAddYouTubeUrlToQueue(message, url, repetitions = 1) {
  //   try {
  //     const { videoDetails } = await ytdl.getInfo(url);
  //     this._currentMessage = message;

  //     if (!message.member.voice.channel) {
  //       message.reply('You need to join a voice channel first!');
  //       return false;
  //     }

  //     if (!this._isBotConnectedToChannel) {
  //       const voiceChannel = message.member.voice.channel;
  //       this.setIsBotConnectedToChannel(true);
  //       joinVoiceChannel({
  //         channelId: voiceChannel.id,
  //         guildId: voiceChannel.guild.id,
  //         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  //       }).subscribe(this.audioPlayer);
  //     }
  //     const isInPlayingState =
  //       this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  //     if (isInPlayingState) {
  //       this.upcoming.push({ 
  //         url, 
  //         metadata: { ...videoDetails, repetitions }
  //       });
  //       const embeddedQueue = new EmbedBuilder()
  //         .setColor(0x0099FF)
  //         .setTitle(videoDetails.title)
  //         .setURL(videoDetails.video_url)
  //         .setAuthor({ name: 'Added Track' })
  //         .addFields(
  //           {
  //             name: 'Position in upcoming',
  //             value: `${this.upcoming.length}`,
  //             inline: true,
  //           },
  //           {
  //             name: 'Repetitions',
  //             value: `${repetitions}`,
  //             inline: true,
  //           }
  //         )
  //         .setThumbnail(videoDetails.thumbnails[2].url)
  //         .setTimestamp()
  //         .setFooter(
  //           {
  //             text: `Requested by ${message.author.username}`,
  //             iconURL: `${message.author.displayAvatarURL()}`
  //           }
  //         );
  //       message.channel.send({ embeds: [embeddedQueue] });
  //     } else {
  //       this.nowPlayingMetadata = { ...videoDetails, repetitions: 1 };
  //       const stream = await play.stream(url);
  //       this.audioPlayer.play(
  //         createAudioResource(stream.stream, { inputType: stream.type })
  //       );
  //       if (repetitions > 1) {
  //         this.playOrAddYouTubeUrlToQueue(message, url, repetitions - 1);
  //       }
  //     }
  //     return true;
  //   } catch (e) {
  //     console.error('couldnt play song:', e);
  //     return false;
  //   }
  // }
}

module.exports = { MusicSingleton };
