const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'deleteStudyChannel',
  description: 'delete an existing study channel (text)',
  category: 'mod',
  aliases: ['dsc'],
  permissions: 'admin',
  example: 's!dsc CMPE126',
  execute: async (message, args) => {
    const author = message.member;
    const { channels, roles } = message.guild;
    // Check for author permissions
    if (!isOfficer(author)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }

    // Incorrect arguments
    if (args.length != 1) {
      message.channel.send('You need to give the name of the class!');
      return;
    }
    const newChannelName = args[0].toLowerCase();

    // Study category does not exist
    let studyChannel = channels.array().filter(
      (x) => x.type == 'category' && x.name == 'study'
    );
    if (studyChannel.length == 0) {
      message.channel.send('Create a study category first!');
      return;
    }
    if (studyChannel.length > 1) {
      message.channel.send('Ambiguous command. Delete a study category first');
      return;
    }

    // Set study category
    studyChannel = studyChannel[0];

    // Find targetted channel
    let textChannels = channels.array().filter(
      (x) => (x.type == 'text' && x.parentID == studyChannel.id
        && x.name == newChannelName)
    );

    // Delete channel
    if (textChannels.length == 0) {
      message.channel.send('No channel to delete!');
    } else {
      let targetChannel = textChannels[0];
      await targetChannel.delete()
        .then(
          message.channel.send(`Deleted channel ${targetChannel.name}`)
        );
    }

    // Delete the role
    let classRole = roles.array().filter(
      (x) => x.name == newChannelName
    );
    let targetRole;
    // If role exists - change its permissions
    if (classRole.length > 0) {
      targetRole = classRole[0];
      // Delete role
      await targetRole.delete()
        .then(
          message.channel.send(`Deleted role ${targetRole.name}`));
    } else {
      message.channel.send('No role to delete!');
    }
  },
});
