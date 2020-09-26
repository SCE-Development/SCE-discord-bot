const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');
const e = require('express');

module.exports = new Command({
  name: 'mute',
  description: 'Mute someone',
  category: 'Server management',
  aliases: [],
  permissions: 'admin',
  execute: (message, args) => {
    const author = message.member;
    // Check if author can warn
    if (!isOfficer(author)) {
      // something about cannot mute
      message.channel.send(author + ', you do not have that permission!');
    }
    if (args.join(' ') == '') {
      message.channel.send('You need to give a user to mute.');
      // or set perms
      return;
    }
    const user = message.guild.member(args[0].match(/(\d+)/)[0]);
    const roles = message.guild;
    let reason = args.slice(1).join(' ');
    // check if muted role exists
    let mutedRole = roles.array().filter(
      (x) => x.name == "Muted"
    );
    let targetRole;
    // if role does not exist, create role
    if (mutedRole.length > 0) {
      targetRole = mutedRole[0];
      await targetRole.setPermissions(0)
        .then(message.channel.send('Reset role permissions'));
    } else {
      await message.guild.createRole(
        {
          name: "Muted",
          permissions: 0
        }
      )
      .then((res) => {
        targetRole = res;
      });
    }
    // set permissions: cannot speak in any channel
    // apply to user
    // if user has muted role, remove role
  }
});
