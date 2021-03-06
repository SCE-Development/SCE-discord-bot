const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'kick',
  description: 'Kick someone',
  aliases: ['boot'],
  example: 's!kick @user <message>',
  permissions: 'admin',
  category: 'Server management',
  execute: async (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to give a user to kick');
      return;
    }
    const author = message.member;
    const user = message.guild.member(args[0].match(/(\d+)/)[0]);
    let reason = args.slice(1).join(' ');
    // Check if author can kick
    if (isOfficer(author)) {
      // Officers may not kick each other
      if (isOfficer(user)) {
        message.channel.send(
          `Not enough permissions to kick. ${user} not kicked.`
        );
        return;
      }

      if (reason) {
        await user.send(
          `You have been kicked from ${message.guild} ` + `because  ${reason}`
        );
      } else {
        await user.send(`You have been kicked from ${message.guild}`);
      }

      user
        .kick(reason)
        .then(() => {
          if (reason) {
            message.channel.send(`${user} has been kicked because ${reason}`);
          } else {
            message.channel.send(`${user} has been kicked`);
          }
        })
        .catch(() => {
          message.channel.send(`SCE Bot cannot kick ${user}`);
          user.send(`Actually, you were not kicked from ${message.guild}`);
        });
    } else {
      message.channel.send(`${author}, you do not have permissions to kick!`);
    }
  },
});
