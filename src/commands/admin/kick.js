const Command = require('../Command');

module.exports = new Command({
  name: 'kick',
  description: 'Kick someone',
  category: 'Server management',
  aliases: ['boot'],
  permissions: 'admin',
  execute: (message, args) => {
    if (args.join(' ') == '') {
      message.channel.send('You need to give a user to kick');
      return;
    }
    const author = message.member;
    const user = message.guild.member(args[0].match(/(\d+)/)[0]);
    console.log(args[0]);
    let reason = args.slice(1).join(' ');
    if (author.permissions.has('ADMINISTRATOR')) {
      user.kick(reason)
        .then(() => {
          if (reason) {
            user.send('You have been kicked from ' + message.guild
              + ' because ' + reason);
            message.channel.send(user + ' has been kicked because '
              + reason);

          } else {
            user.send('You have been kicked from ' + message.guild);
            message.channel.send(user + ' has been kicked');
          }
        })
        .catch(() => {
          message.channel.send('Not enough permissions to kick. '
            + user + ' not kicked.');
        });
    } else {
      message.channel.send(author
        + ', you do not have permissions to kick!');
    }
  }
});
