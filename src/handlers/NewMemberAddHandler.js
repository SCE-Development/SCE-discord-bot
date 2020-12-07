/**
 * Class which handles a new member coming to the server
 */
class NewMemberAddHandler {
  /** 
   * Function that assigns the new member the notification role when they join
   * @param {GuildMember} newMember The new member in the server
  */
  async handleNewMember(newMember) {
    const { roles } = newMember.guild;
    const targetRole = roles.array().filter(
      (role) => role.name == 'Notification'
    );
    if (targetRole[0]) {
      await newMember.addRole(targetRole[0]);
    }
    await newMember.send(`Welcome to ${newMember.guild.name}!`);
  }
}

module.exports = { NewMemberAddHandler };
