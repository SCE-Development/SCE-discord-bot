const Command = require('../Command');

module.exports = new Command({
  name: 'sid',
  description: 'grab server ID',
  aliases: [],
  example: 's!sid',
  permissions: 'general',
  category: 'information',
  // eslint-disable-next-line
  execute: (message, args) => {
    message.channel.send('Guild ID is ' + message.guild.id);
  }
});
