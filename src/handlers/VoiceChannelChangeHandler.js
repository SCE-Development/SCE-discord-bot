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
  handleChangeMemberInVoiceChannel(oldState) {
    try {
      const vc = oldState.channel;
      if (vc && vc.members.size === 0) {
        const re = /(?<=: : \().+(?=\))/;
        if (re.test(vc.name)) {
          const oriname = vc.name.match(re)[0];
          vc.edit({ name: oriname }).catch(console.error);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = { VoiceChannelChangeHandler };
