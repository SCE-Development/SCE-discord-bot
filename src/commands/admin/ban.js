const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'ban',
  description: 'Ban someone',
  aliases: [],
  example: 's!ban @user <message>',
  permissions: 'admin',
  category: 'Server management',
  execute: async (message, args) => {
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
        message.channel.send(
          `Not enough permissions to ban. ${user} not banned.`
        );
        return;
      }

      if (reason) {
        await user.send(
          `You have been banned from ${message.guild} because ${reason}`
        );
      } else {
        await user.send(`You have been banned from ${message.guild}`);
      }
      user
        .ban({ reason })
        .then(() => {
          if (reason) {
            message.channel.send(`${user} has been banned because ${reason}`);
          } else {
            message.channel.send(`${user} has been banned`);
          }
        })
        .catch(() => {
          message.channel.send(`SCE Bot cannot ban ${user}`);
          user.send(`Actually, you were not banned from ${message.guild}`);
        });
    } else {
      message.channel.send(`${author}, you do not have permissions to ban!`);
    }
  },
});
