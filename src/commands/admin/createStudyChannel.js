const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'createstudychannel',
  description: 'Create a new study channel',
  aliases: ['csc'],
  example: 's!csc <channelname> [-f | --force]',
  permissions: 'admin',
  category: 'mod',
  execute: async (message, args) => {
    const author = message.member;
    const { guild } = message;
    const { channels } = guild;
    let newChannelName;
    // Check for author permissions
    if (!isOfficer(author)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }

    // Study category does not exist
    const studyCategory = channels.cache.find(
      channel => channel.type === 'category' && channel.name === 'study'
    );
    if (!studyCategory) {
      message.channel.send('Create a study category first!');
      return;
    }

    // Alphabetize arrays
    let studyChannels = channels.cache
      .array()
      .filter(
        channel =>
          channel.type == 'text' && channel.parentID == studyCategory.id
      )
      .sort((channel1, channel2) => {
        let channel1prefix = channel1.name.match(/\D{2,3}/);
        let channel2prefix = channel2.name.match(/\D{2,3}/);
        if (channel1prefix < channel2prefix) {
          return -1;
        } else if (channel1prefix > channel2prefix) {
          return 1;
        } else {
          let channel1suffix = channel1.name.match(/\d{2,3}/);
          let channel2suffix = channel2.name.match(/\d{2,3}/);
          if (Number(channel1suffix) < Number(channel2suffix)) return -1;
          else return 1;
        }
      });
    let minNumber = Math.min(...studyChannels.map(x => x.position));
    for (let i = minNumber; i < minNumber + studyChannels.length; i++) {
      let currentChannel = studyChannels[i - minNumber];
      if (currentChannel.position != i) {
        currentChannel.edit({ position: i });
      }
    }

    if (args.length == 0) {
      // Sort channels
      message.channel.send('You have successfully sorted the channels!');
      return;
    } else if (args.length == 1) {
      // 1 argument - channel name
      const regex = RegExp(/((CMPE)|(CS))+\d+/i);
      if (!regex.test(args[0])) {
        message.channel.send('This is not a valid class!');
        return;
      }
      newChannelName = args[0].toLowerCase();
    } else if (args.length == 2) {
      // 2 arguments: 1 must contain force
      const forceRegex = RegExp(/(-f)|(-{0,}force)/i);
      const forceIndex = args.findIndex(element => {
        return forceRegex.test(element);
      });
      if (forceIndex == -1) {
        message.channel.send(
          'To create a channel not class specific, ' + 'use force!'
        );
        return;
      }
      args.splice(forceIndex, forceIndex + 1);
      if (forceRegex.test(args[0])) {
        message.channel.send(
          'You have provided 2 force parameters! ' +
            'Please provide a channel name'
        );
        return;
      }
      newChannelName = args[0].toLowerCase();
    } else {
      // Too many arguments
      message.channel.send('Too many arguments!');
      return;
    }

    const textChannel = channels.cache.find(
      channel =>
        channel.type === 'text' &&
        channel.parentID === studyCategory.id &&
        channel.name === newChannelName
    );

    // Check if this exists already
    if (textChannel) {
      message.channel.send('Channel exists already!');
      return;
    }

    // Create a new role
    const roles = await guild.roles.fetch();
    const classRole = roles.cache.find(role => role.name === newChannelName);
    let targetRole;
    // If role exists - change its permissions
    if (classRole) {
      targetRole = classRole;
      // Reset role's permissions
      await targetRole
        .setPermissions(0)
        .then(message.channel.send('Reset role permissions'));
    } else {
      // Create role
      await guild.roles
        .create({
          data: {
            name: newChannelName,
            permissions: 0,
          },
          reason: 'Study Channel',
        })
        .then(res => {
          targetRole = res;
        });
    }

    // Create the channel
    let newChannelOptions = {
      parent: studyCategory.id,
      permissionOverwrites: [
        {
          id: targetRole.id,
          allow: 1024,
        },
        {
          id: roles.everyone.id,
          deny: 1024,
        },
      ],
    };
    message.guild.channels
      .create(newChannelName, newChannelOptions)
      .then(() => {
        message.channel.send(
          `${author} created a study channel for ${newChannelName}`
        );
      })
      .catch(() => {
        message.channel.send('There was an error creating the channel');
      });
  },
});
