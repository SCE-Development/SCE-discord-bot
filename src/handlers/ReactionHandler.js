const { REACTIONS = {} } = require('../../config.json'); // Adjust the path as needed
const { EmbedBuilder } = require('discord.js');
  /**
   * Add a reaction handler to the handler list.
   * @param {Message} message - The message to add reaction to.
   * @param {string} emoji - The emoji to react with.
   * @param {Function} handler - The function to handle the reaction.
   * @param {Boolean} reactionWasRemoved
   */
class ReactionHandler {
  async handleReaction(reaction, user, reactionWasRemoved = false) {
    const emoji = reaction.emoji.name;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (REACTIONS[reaction.message.id]) {
      try {
        const role = reaction.message.guild.roles.cache.get(
          REACTIONS[reaction.message.id][emoji]
        );
        const embed = new EmbedBuilder()
        .setTitle("Roles Updated")
        .setDescription(`You reacted to this [this message](${reaction.message.url}) in the server, SCE-dev, and changed your roles.`)
        .setFooter({text: "Sent by the Reaction Roles bot on behalf of the server, SCE-dev", iconURL: "https://cdn.discordapp.com/avatars/623204767144869889/0fb4aff95f3f3026e48633a72a2380a2.webp?size=80"});
        embed.addFields(
          { name: "Roles Added", value: `${role.name}` }
        )
        if (REACTIONS[reaction.message.id].reverse) {
          return member.roles.remove(role);
        }
        if (reactionWasRemoved) {
          member.roles.remove(role);
        }
        else {
          member.roles.add(role);
          await member.send({embeds: [embed]});
        }
      } catch (e) {
        console.log('Role does not exist', e);
      }
    }
  }
}
module.exports = { ReactionHandler }