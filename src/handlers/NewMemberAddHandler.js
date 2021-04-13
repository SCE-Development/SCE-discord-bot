/**
 * Class which handles a new member coming to the server
 */
class NewMemberAddHandler {
  /**
   * Function that assigns the new member the notification role when they join
   * @param {GuildMember} newMember The new member in the server
   */
  async handleNewMember(newMember) {
    try {
      const roles = await newMember.guild.roles.fetch();
      const targetRole = roles.cache.find(role => role.name === 'Notification');
      if (targetRole) {
        await newMember.roles.add(targetRole);
      }
      await newMember.send(`Welcome to ${newMember.guild.name}!`);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = { NewMemberAddHandler };
