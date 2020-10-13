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
        const sname = ovc.name.split(': : (');
        if (sname.length > 1) {
          const oriname = sname[sname.length-1];
          ovc.edit({name: oriname.substring(0, oriname.length - 1)})
            .catch(console.error);
        }
      }
    }
  }
}

module.exports = { VoiceChannelChangeHandler };
