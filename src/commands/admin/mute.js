const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');
const { CommandCategory } = require('../../util/enums');


module.exports = new Command({
  name: 'mute',
  description: 'Mute someone, or unmutes if the person is muted.',
  aliases: [],
  example: 's!mute @user <message>',
  permissions: 'admin',
  category: CommandCategory.SERVER_MANAGEMENT,
  execute: async (message, args) => {
    const author = message.member;
    // Check if author can mute
    if (!isOfficer(author)) {
      message.channel.send(`${author}, you do not have that permission!`);
      return;
    }
    // Must mention a user in the server to mute them
    if (args.join(' ') == '') {
      message.channel.send('You need to mention a user to mute!');
      return;
    }
    const user = message.guild.member(
      args[0].match(/(\d+)/) && args[0].match(/(\d+)/)[0]
    );
    if (!user) {
      message.channel.send('You need to mention a valid user to mute!');
      return;
    }
    // Officers cannot mute other officers
    if (isOfficer(user)) {
      message.channel.send(`${author}, you cannot mute other officers!`);
      return;
    }
    const { roles } = message.guild;
    let reason = args.slice(1).join(' ');
    // Check if muted role exists
    let mutedRole = roles.array().filter(x => x.name == 'Muted');
    let targetRole;
    // If role does not exist, create role
    if (mutedRole.length > 0) {
      targetRole = mutedRole[0];
      await targetRole.setPermissions(0);
    } else {
      await message.guild
        .createRole({
          name: 'Muted',
          permissions: 0,
        })
        .then(res => {
          targetRole = res;
        });
    }
    // Changes the permissions for every channel
    for (let i = 0; i < message.guild.channels.array().length; i++) {
      await message.guild.channels.array()[i].overwritePermissions(targetRole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
      });
    }
    // If user has muterole, remove it; if not, add it
    if (user.roles.find(x => x.name === 'Muted')) {
      await user.roles
        .remove(targetRole)
        .then(() => message.channel.send(`${user} **unmuted**.`));
    } else {
      await user.roles.add(targetRole).then(() => {
        if (reason) {
          message.channel.send(`${user} was **muted**, *${reason}*`);
          user.send(`You were **muted**, *${reason}*`);
        } else {
          message.channel.send(`${user} has been **muted**.`);
          user.send('You have been **muted**. No reason was given.');
        }
        return;
      });
    }
  },
});
