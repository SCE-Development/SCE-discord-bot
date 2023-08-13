const Command = require('../Command');
const { CommandCategory } = require('../../util/enums');


module.exports = new Command({
  name: 'jail',
  description: 'Create channel (text)',
  aliases: [],
  example: 's!jail @user', 
  permissions: 'admin',
  category: CommandCategory.MOD,
  disabled: true,
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to tag someone to jail!');
      return;
    }
  },
});
