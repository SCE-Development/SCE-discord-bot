const Command = require('../Command');

module.exports = new Command({
  name: 'jail',
  description: 'Create channel (text)',
  aliases: [],
  example: 's!jail @user', 
  permissions: 'admin',
  category: 'mod',
  disabled: true,
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to tag someone to jail!');
      return;
    }
  },
});
