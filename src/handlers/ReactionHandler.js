const { REACTIONS = {} } = require('../../config.json'); // Adjust the path as needed

class ReactionHandler {

    /**
     * Add a reaction handler to the handler list.
     * @param {Message} message - The message to add reaction to.
     * @param {string} emoji - The emoji to react with.
     * @param {Function} handler - The function to handle the reaction.
     * @param {Boolean} reactionWasRemoved
     */

    async handleReaction(reaction, user, reactionWasRemoved = false) {
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
              if (reactionWasRemoved) {
                member.roles.remove(role);
              }
              else {
                member.roles.add(role);
                await member.send(`Hello @${member.user.username}, you have been assigned the role ${role.name}`);
              }
            } catch (e) {
              console.log('Role does not exist', e);
            }
        }
    }
}

module.exports = { ReactionHandler }