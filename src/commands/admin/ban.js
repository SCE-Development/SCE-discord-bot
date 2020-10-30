const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'ban',
  description: 'Ban someone',
  category: 'Server management',
  aliases: [],
  permissions: 'admin',
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to give a user to ban');
      return;
    }
    const author = message.member;
    const user = message.guild.member(args[0].match(/(\d+)/)[0]);
    let reason = args.slice(1).join(' ');
    if (isOfficer(author)) {
      // Don't ban officers
      if (isOfficer(user)) {
        message.channel.send('Not enough permissions to ban. '
          + user + ' not banned.');
        return;
      }
      user.ban(reason)
        .then(() => {
          if (reason) {
            user.send('You have been banned from ' + message.guild
              + ' because ' + reason);
            message.channel.send(user + ' has been banned because '
              + reason);

          } else {
            user.send('You have been banned from ' + message.guild);
            message.channel.send(user + ' has been banned');
          }
        })
        .catch(() => {
          message.channel.send('Not enough permissions to ban. '
            + user + ' not banned.');
        });
    } else {
      message.channel.send(author
        + ', you do not have permissions to ban!');
    }
  }
});
