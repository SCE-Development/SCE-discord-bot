const Command = require('../Command');

module.exports = new Command({
  name: 'sid',
  description: 'grab server ID',
  category: 'information',
  aliases: [],
  permissions: 'general',
  // eslint-disable-next-line
  execute: (message, args) => {
    message.channel.send('Guild ID is ' + message.guild.id);
  }
});
