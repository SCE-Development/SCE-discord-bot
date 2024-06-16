const config = require('../../config.json');

/**
 * Class which handles a new member coming to the server
 */
class NewMemberAddHandler {
  /**
   * Function that handles a new member joining the server
   * @param {GuildMember} newMember The new member in the server
   */
  async handleNewMember(newMember) {
    try {

      const guild = newMember.guild;
      const channels = guild.channels.cache;
      const newMemberChannelId = config.WELCOME.NEW_MEMBER_CHANNEL_ID;
      const welcomeChannel = channels.get(newMemberChannelId);
      const guildName = guild.name;

      const message = 
      `<@${newMember.user.id}> welcome to ${guildName}! Please read ` +
      `server rules in <#${config.WELCOME.WELCOME_CHANNEL_ID}> and ` +
      `<#${config.WELCOME.INTRODUCE_YOURSELF_CHANNEL_ID}> so we can ` +
      'get to know you.';


      // send message to new member in welcome channel
      if (welcomeChannel) {
        await welcomeChannel.send(message);
        console.log('Sent welcome message in ${welcomeChannel.name}');
      } else {
        console.log('Welcome channel not found');
      }
    } 
    
    catch (e) {
      console.error(e);
    }
  }
}

module.exports = { NewMemberAddHandler };
