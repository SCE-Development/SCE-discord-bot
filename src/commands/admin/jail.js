const Command = require('../Command');

module.exports = new Command({
  name: 'jail',
  description: 'create channel (text)',
  category: 'mod',
  aliases: [],
  permissions: 'admin',
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to tag someone to jail!');
      return;
    }
  },
});
