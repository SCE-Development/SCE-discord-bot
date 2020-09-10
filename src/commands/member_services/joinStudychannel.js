const Command = require('../Command');

module.exports = new Command({
  name: 'joinStudyChannel',
  description: 'Join a study channel',
  category: 'member services',
  aliases: ['jsc'],
  permissions: 'member',
  example: 's!jsc CMPE126',
  execute: async (message, args) => {
    const author = message.member;
    const { roles } = message.guild;

    // Incorrect arguments
    if (args.length != 1) {
      message.channel.send('You need to give the name of the class!');
      return;
    }
    const targetClass = args[0].toLowerCase();

    // Assign the role
    let classRole = roles.array().filter(
      (x) => x.name == targetClass
    );
    let targetRole;
    // If role exists - change its permissions
    if (classRole.length > 0) {
      targetRole = classRole[0];
      // Assign the role to the user
      await author.addRole(targetRole)
        .then(() =>
          message.channel.send(author + ` has joined ${targetClass}`)
        );
    } else {
      message.channel.send(`The class ${targetClass} has not been set up yet. `
        + 'Message an officer to create the channel!');
    }
  },
});
