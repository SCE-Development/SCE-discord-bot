const { getVoiceConnection } = require('@discordjs/voice');

const MusicSingleton = require('../util/MusicSingleton');
const musicHandler = new MusicSingleton();
/**
 * Class Which handles change in voicechannel
 */
class VoiceChannelChangeHandler {
  /**
   * Function that rename the channel back when the channel is empty
   *
   * @param {VoiceState} oldState The old voice channel state.
   * @param {VoiceState} newSTate the new voice channel state.
   */
  handleChangeMemberInVoiceChannel(oldState, newState) {
    let userCount;
    let voiceChannel;
    // console.log('oldstate', oldState.channel.members)
    if (oldState.channelId !== newState.channelId) {
      // Check if the new state has a voice channel
      if (newState.channel) {
        // Get the voice channel
        voiceChannel = newState.channel;

        // Get the number of users in the voice channel
        userCount = voiceChannel.members.size;
        // console.log('# of users in voice channel: ', userCount);
      }
      if (oldState.channel) {
        voiceChannel = oldState.channel;
        // Get the number of users in the voice channel
        userCount = voiceChannel.members.size;
      }

      let connection = getVoiceConnection(voiceChannel.guild.id);
      if (connection && userCount === 1) {
        musicHandler.stop();
      }
    }
  }
}

module.exports = { VoiceChannelChangeHandler };
