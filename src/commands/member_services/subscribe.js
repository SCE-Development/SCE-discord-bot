const Command = require('../Command');
module.exports = new Command({
  name: 'subscribe',
  description: 'subscribes user to discord SCE notifications',
  aliases: [],
  example: '!subscribe',
  permissions: 'general',
  category: 'member services',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const roles = await message.guild.roles.fetch();
    const targetRole = roles.cache.find(role => role.name === 'Notification');

    if (!targetRole) return;

    await message.member.roles
      .add(targetRole)
      .then(() =>
        message.channel.send(
          `${message.member} has subscribed to ${message.guild} notifications`
        )
      )
      .catch(() => message.channel.send('Could not add role'));
  },
});
