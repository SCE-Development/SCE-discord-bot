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
    const { guild } = message;
    const { channels } = guild;

    // Incorrect arguments
    if (args.length === 0) {
      message.channel.send('You need to give the name of the class!');
      return;
    }
    const targetClass = args.join('').toLowerCase();

    // Get role to be assigned
    const roles = await guild.roles.fetch();
    let classRole = roles.cache.find(x => x.name === targetClass);

    // Make sure the role is a STUDY CHANNEL Role
    const studyCategory = channels.cache.find(
      channel => channel.type === 'category' && channel.name === 'study'
    );
    if (!studyCategory) {
      message.channel.send('There are no study categories!');
      return;
    }

    const textChannel = channels.cache.find(
      channel =>
        channel.type === 'text' &&
        channel.parentID === studyCategory.id &&
        channel.name === targetClass
    );
    if (!textChannel) {
      message.channel.send(
        `The class ${targetClass} has not been set up yet. ` +
          'Message an officer to create the channel!'
      );
      return;
    }

    // If role exists - change its permissions
    if (classRole) {
      // Assign the role to the user
      if (author.roles.cache.find(x => x.name === targetClass)) {
        // If user has the role, remove them from the class
        await author.roles
          .remove(classRole)
          .then(() =>
            message.channel.send(
              `${author} has left the ${targetClass} ` + 'channel'
            )
          );
      } else {
        // Subscribe user to a class
        await author.roles
          .add(classRole)
          .then(() =>
            message.channel.send(`${author} has joined ${targetClass}`)
          );
      }
    } else {
      message.channel.send(
        `The class ${targetClass} has not been set up yet. ` +
          'Message an officer to create the channel!'
      );
    }
  },
});
