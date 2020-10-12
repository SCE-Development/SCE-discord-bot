const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'createstudychannel',
  description: 'create new study channel (text)',
  category: 'mod',
  aliases: ['csc'],
  permissions: 'admin',
  example: 's!csc CMPE126',
  execute: async (message, args) => {
    const author = message.member;
    const { channels, roles } = message.guild;
    let newChannelName;
    // Check for author permissions
    if (!isOfficer(author)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }

    // Study category does not exist
    let studyCategory = channels.array().filter(
      (channel) => channel.type == 'category' && channel.name == 'study'
    );
    if (studyCategory.length == 0) {
      message.channel.send('Create a study category first!');
      return;
    }
    if (studyCategory.length > 1) {
      message.channel.send('Ambiguous command. Delete a study category first');
      return;
    }
    // Set study category
    studyCategory = studyCategory[0];

    // Alphabetize arrays
    let studyChannels = channels.array().filter(
      (channel) => (
        channel.type == 'text' && channel.parentID == studyCategory.id
      )
    ).sort((channel1, channel2) => {
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
    let minNumber = Math.min(...studyChannels.map((x) => x.position));
    for (let i = minNumber; i < (minNumber + studyChannels.length); i++) {
      let currentChannel = studyChannels[i - minNumber];
      if (currentChannel.position != i) {
        currentChannel.edit({ position: i });
      }
    }

    if (args.length == 0) {
      // Sort channels
      message.channel.send('You have successfully sorted the channels!');
      return;
    }
    else if (args.length == 1) {
      // 1 argument - channel name
      const regex = RegExp(/((CMPE)|(CS))+\d+/i);
      if (!regex.test(args[0])) {
        message.channel.send('This is not a valid class!');
        return;
      }
      newChannelName = args[0].toLowerCase();
    }
    else if (args.length == 2) {
      // 2 arguments: 1 must contain force
      const forceRegex = RegExp(/(-f)|(-{0,}force)/i);
      const forceIndex = args.findIndex((element) => {
        return forceRegex.test(element);
      });
      if (forceIndex == -1) {
        message.channel.send('To create a channel not class specific, '
          + 'use force!');
        return;
      }
      args.splice(forceIndex, forceIndex + 1);
      if (forceRegex.test(args[0])) {
        message.channel.send('You have provided 2 force parameters! '
          + 'Please provide a channel name');
        return;
      }
      newChannelName = args[0].toLowerCase();
    }
    else {
      // Too many arguments
      message.channel.send('Too many arguments!');
      return;
    }


    let textChannels = channels.array().filter(
      (channel) => (
        channel.type == 'text'
        && channel.parentID == studyCategory.id
        && channel.name == newChannelName)
    );

    // Check if this exists already
    if (textChannels.length != 0) {
      message.channel.send('Channel exists already!');
      return;
    }

    // Create a new role
    let classRole = roles.array().filter(
      (role) => role.name == newChannelName
    );
    let targetRole;
    // If role exists - change its permissions
    if (classRole.length > 0) {
      targetRole = classRole[0];
      // Reset role's permissions
      await targetRole.setPermissions(0)
        .then(message.channel.send('Reset role permissions'));
    } else {
      // Create role
      await message.guild.createRole(
        {
          name: newChannelName,
          permissions: 0
        }
      )
        .then((res) => {
          targetRole = res;
        });
    }

    let everyoneRole = roles.array().filter(
      (role) => role.name == '@everyone'
    )[0];

    // Create the channel
    let newChannelOptions = {
      parent: studyCategory.id,
      permissionOverwrites: [
        {
          id: targetRole.id,
          allow: 1024
        },
        {
          id: everyoneRole.id,
          deny: 1024
        }
      ]
    };
    message.guild.createChannel(newChannelName, newChannelOptions)
      .then(() => {
        message.channel.send(author + ' created a study channel for '
          + newChannelName);
      })
      .catch(() => {
        message.channel.send('There was an error creating the channel');
      });
  },
});