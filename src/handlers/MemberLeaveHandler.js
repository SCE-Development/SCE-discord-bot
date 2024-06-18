const config = require('../../config.json');

/**
 * Class which handles a member leaving the server
 */
class MemberLeaveHandler {
  /**
     * Function that handles a member leaving the server
     * @param {GuildMember} member The member who left the server
     */
  async handleMemberLeave(member) {
    try {
      console.log('handleMemberLeave called');
      const guild = member.guild;
      const channels = guild.channels.cache;
      const leaveChannelId = config.WELCOME.NEW_MEMBER_CHANNEL_ID;
      const leaveChannel = channels.get(leaveChannelId);

      const message = 
      `We're sorry to see you leaving, ${member.user.username}!` + 
      '\n\nWe hope to see you soon!';

      // send message to the leave channel
      if (leaveChannel) {
        await leaveChannel.send(message);
      } else {
        console.log('Leave channel not found');
      }
    } catch (e) {
      console.error('Error in handleMemberLeave:', e);
    }
  }
}

module.exports = { MemberLeaveHandler };
