const Command = require('../Command');
module.exports = new Command({
  name: 'unsubscribe',
  description: 'unsubscribes user from discord SCE notifications',
  aliases: ['unsub'],
  example: '!unsubscribe',
  permissions: 'general',
  category: 'member services',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const roles = await message.guild.roles.fetch();
    const targetRole = roles.cache.find(role => role.name === 'Notification');

    if (!targetRole) return;

    await message.member.roles
      .remove(targetRole)
      .then(() =>
        message.channel.send(
          `${message.member} has unsubscribed from ${message.guild} ` +
            'notifications'
        )
      )
      .catch(() => message.channel.send('Could not remove role'));
  },
});
