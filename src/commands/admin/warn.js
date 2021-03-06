const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'warn',
  description: 'Warn someone',
  aliases: [],
  example: 's!warn @user <message>',
  permissions: 'admin',
  category: 'Server management',
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to mention a user to warn!');
      return;
    }
    const author = message.member;
    const user = message.guild.member(
      args[0].match(/(\d+)/) && args[0].match(/(\d+)/)[0]
    );
    let reason = args.slice(1).join(' ');
    // Check if author can warn
    if (isOfficer(author)) {
      // User must be in the server to warn
      if (!user) {
        message.channel.send('You need to mention a valid user to mute!');
        return;
      }
      if (reason) {
        user.send(`You were **warned**, *${reason}*`);
        message.channel.send(`${user} was **warned**, *${reason}*`);
      } else {
        user.send('You have been **warned**. No reason was given.');
        message.channel.send(`${user} has been **warned**.`);
      }
    } else {
      message.channel.send(`${author}, you do not have permissions to warn!`);
    }
  },
});
