/**
 * Class Which handles change in voicechannel
 */
class VoiceChannelChangeHandler {
  /** 
   * Function that rename the channel back when the channel is empty
   * @param {GuildMember} oldMember The old member in the voice chat
   *  before the change
  */
  handleChangeMemberInVoiceChannel(oldMember) {
    const ovcID = oldMember.voiceChannelID;
    if (ovcID) {
      const ovc = oldMember.guild.channels.get(ovcID);
      if (ovc.members.size === 0) {
        const re = /(?<=: : \().+(?=\))/;
        if (re.test(ovc.name)) {
          const oriname = ovc.name.match(re)[0];
          ovc.edit({name: oriname})
            .catch(console.error);
        }
      }
    }
  }
}

module.exports = { VoiceChannelChangeHandler };
