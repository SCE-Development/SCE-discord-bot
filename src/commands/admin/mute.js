const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');
const e = require('express');

module.exports = new Command({
  name: 'mute',
  description: 'Mute someone',
  category: 'Server management',
  aliases: [],
  permissions: 'admin',
  execute: async (message, args) => {
    const author = message.member;
    const user = message.guild.member(args[0].match(/(\d+)/)[0]);
    // Check if author can mute
    if (!isOfficer(author)) {
      message.channel.send(author + ', you do not have that permission!');
      return;
    }
    // Officers cannot mute other officers
    if (isOfficer(user)) {
      message.channel.send(author + ', you cannot mute other officers!');
      return;
    }
    if (args.join(' ') == '') {
      message.channel.send('You need to give a user to mute.');
      // or set perms
      return;
    }
    const { channels, roles } = message.guild;
    let reason = args.slice(1).join(' ');
    // Check if muted role exists
    let mutedRole = roles.array().filter(
      (x) => x.name == "Muted"
    );
    let targetRole;
    // If role does not exist, create role
    if (mutedRole.length > 0) {
      targetRole = mutedRole[0];
      await targetRole.setPermissions(0);
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
    // Set permissions: cannot speak in any channel
    const replacementPerms = {
      id: targetRole.id,
      deny: 2048
    }

    await message.channel.replacePermissionOverwrites({ // .guild doesn't work, .channel does
      overwrites: [replacementPerms],
    })
      .then(() => {
        if (user.roles.array().map((x) => x.name).includes("Muted")) {
          user.removeRole(targetRole)
            .then(() =>
              message.channel.send(user + ' has been unmuted.')
            );
        }
        else {
          user.addRole(targetRole)
            .then(() => {
              if (reason) {
                message.channel.send(user + ' has been muted for ' + reason + '.');
                message.user.send('You have been muted for ' + reason + '.')
              } else {
                message.channel.send(user + ' has been muted.');
                message.user.send('You have been muted. No reason was given.')
              }
            }
            );
        }
      })
      .catch(() => {
        message.channel.send('There was an error in editing permissions!')
      });
  }
});
