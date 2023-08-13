const Command = require('../Command');
const { CommandCategory } = require('../../util/enums');


module.exports = new Command({
  name: 'sid',
  description: 'grab server ID',
  aliases: [],
  example: 's!sid',
  permissions: 'general',
  category: CommandCategory.INFORMATION,
  // eslint-disable-next-line
  execute: (message, args) => {
    message.channel.send('Guild ID is ' + message.guild.id);
  }
});
