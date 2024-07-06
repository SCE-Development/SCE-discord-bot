const { REACTIONS = {} } = require('../../config.json');
const { EmbedBuilder } = require('discord.js');
/**
* Add a reaction handler to the handler list.
* @param {Message} message - The message to add reaction to.
* @param {string} emoji - The emoji to react with.
* @param {boolean} reactionWasRemoved - Whether reaction was removed
* @param {string} botpfp - Bot's profile picture
*/
class ReactionHandler {
  async handleReaction(reaction, user, botpfp, reactionWasRemoved = false) {
    const emoji = reaction.emoji.name;
    const member = reaction.message.guild.members.cache.get(user.id);

    if (REACTIONS[reaction.message.id]) {
      try {
        const role = reaction.message.guild.roles.cache.get(
          REACTIONS[reaction.message.id][emoji]
        );

        if (REACTIONS[reaction.message.id].reverse) {
          return member.roles.remove(role);
        }

        const guildName = reaction.message.guild.name;
        const embed = new EmbedBuilder()
          .setTitle('Roles Updated')
          .setFooter({
            text: 'Sent by the Reaction Roles bot'
             + ` on behalf of the server, ${guildName}`,
            iconURL: `${botpfp}`
          });
          
        if (reactionWasRemoved) {
          member.roles.remove(role);
          embed.setDescription('You removed your reaction to this ' + 
            `[this message](${reaction.message.url}) in the server, `
            + `${guildName}, and changed your roles.`)
          embed.addFields(
            { name: 'Roles Removed', value: `${role.name}` }
          );
          await member.send({embeds: [embed]});
        } else {
          member.roles.add(role);
          embed.setDescription('You reacted to this ' + 
            `[this message](${reaction.message.url}) in the server, `
            + `${guildName}, and changed your roles.`)
          embed.addFields(
            { name: 'Roles Added', value: `${role.name}` }
          );
          await member.send({embeds: [embed]});
        }
      } catch (e) {
        console.log('Role does not exist', e);
      }
    }
  }
}

module.exports = { ReactionHandler };
