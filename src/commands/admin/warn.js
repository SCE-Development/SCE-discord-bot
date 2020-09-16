const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'warn',
  description: 'Warn someone',
  category: 'Server management',
  aliases: [],
  permissions: 'admin',
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to give a user to warn.');
      return;
    }
    const author = message.member;
    const user = message.guild.member(args[0].match(/(\d+)/)[0]);
    let reason = args.slice(1).join(' ');
    // Check if author can warn
    if (isOfficer(author)) {
      if (reason) {
        user.send('You have been warned because ' + reason + '.');
        message.channel.send(user + ' has been warned because '
          + reason + '.');
      } else {
        user.send('You have been warned.');
        message.channel.send(user + ' has been warned.');
      }
    } else {
      message.channel.send(author
        + ', you do not have permissions to warn!');
    }
  }
});
