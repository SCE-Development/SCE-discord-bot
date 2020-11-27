const Command = require('../Command');

module.exports = new Command({
  name: 'joinstudychannel',
  description: 'Join or leave a study channel',
  aliases: ['jsc'],
  example: 's!jsc <channelname>',
  permissions: 'member',
  category: 'member services',
  execute: async (message, args) => {
    const author = message.member;
    const { roles } = message.guild;

    // Incorrect arguments
    if (args.length != 1) {
      message.channel.send('You need to give the name of the class!');
      return;
    }
    const targetClass = args[0].toLowerCase();

    // Get role to be assigned
    let classRole = roles.array().filter(
      (x) => x.name == targetClass
    );
    let targetRole;

    // Make sure the role is a STUDY CHANNEL Role
    const { channels } = message.guild;
    const studyCategory = channels.array().filter(
      (channel) => channel.type == 'category' && channel.name == 'study'
    );
    if (studyCategory.length == 0) {
      message.channel.send('There are no study categories!');
      return;
    }
    if (studyCategory.length > 1) {
      message.channel.send('Study categories incorrectly set up. ' +
        'Contact an officer.');
      return;
    }
    let studyChannel = studyCategory[0];
    let textChannels = channels.array().filter(
      (channel) => (
        channel.type == 'text'
        && channel.parentID == studyChannel.id
        && channel.name == String(targetClass).replace(/\s/g, '-')
      )
    );
    if (textChannels.length == 0) {
      message.channel.send(`The class ${targetClass} has not been set up yet. `
        + 'Message an officer to create the channel!');
      return;
    }

    // If role exists - change its permissions
    if (classRole.length > 0) {
      targetRole = classRole[0];

      // Assign the role to the user
      if (author.roles.array().map((x) => x.name).includes(targetClass)) {
        // If user has the role, remove them from the class
        await author.removeRole(targetRole)
          .then(() =>
            message.channel.send(author + ` has left the ${targetClass} `
              + 'channel')
          );
      }
      else {
        // Subscribe user to a class
        await author.addRole(targetRole)
          .then(() =>
            message.channel.send(author + ` has joined ${targetClass}`)
          );
      }

    } else {
      message.channel.send(`The class ${targetClass} has not been set up yet. `
        + 'Message an officer to create the channel!');
    }
  },
});
