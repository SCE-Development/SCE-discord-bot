const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'deletestudychannel',
  description: 'Delete an existing study channel',
  aliases: ['dsc'],
  example: 's!dsc <channelname>',
  permissions: 'admin',
  category: 'mod',
  execute: async (message, args) => {
    const author = message.member;
    const { guild } = message;
    const { channels } = guild;
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
    const targetChannel = args[0].toLowerCase();

    // Study category does not exist
    const studyChannel = channels.cache.find(
      x => x.type === 'category' && x.name === 'study'
    );
    if (!studyChannel) {
      message.channel.send('Create a study category first!');
      return;
    }

    // Delete the role
    const roles = await guild.roles.fetch();
    const classRole = roles.cache.find(x => x.name === targetChannel);
    // If role exists - change its permissions
    if (classRole) {
      // Delete role
      await classRole
        .delete()
        .then(message.channel.send(`Deleted role ${classRole.name}`));
    } else {
      message.channel.send('No role to delete!');
    }

    // Find targeted channel
    const textChannel = channels.cache.find(
      x =>
        x.type === 'text' &&
        x.parentID === studyChannel.id &&
        x.name === String(targetChannel).replace(/\s/g, '-')
    );

    // Delete channel
    if (!textChannel) {
      message.channel.send('No channel to delete!');
    } else {
      await textChannel
        .delete()
        .then(
          await message.channel
            .send(`Deleted channel ${textChannel.name}`)
            .catch()
        )
        .catch();
    }
  },
});
