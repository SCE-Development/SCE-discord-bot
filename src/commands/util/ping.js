const Command = require('../Command');

module.exports = new Command({
  name: 'ping',
  description: 'check if the bot is up',
  category: 'information',
  aliases: [],
  permissions: 'general',
  // eslint-disable-next-line
  execute: (message, args) => {
    message.channel.send('pong');
  },
});
