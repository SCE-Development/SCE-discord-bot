const Command = require('../Command');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'createstudyCategory',
  description: 'create new study channel (text)',
  category: 'mod',
  aliases: ['csc'],
  permissions: 'admin',
  example: 's!csc CMPE126',
  execute: async (message, args) => {
    const author = message.member;
    const { channels, roles } = message.guild;
    // Check for author permissions
    if (!isOfficer(author)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }

    // Study category does not exist
    let studyCategory = channels.array().filter(
      (x) => x.type == 'category' && x.name == 'study'
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
      (x) => (x.type == 'text' && x.parentID == studyCategory.id)
    ).sort(
      (x, y) => {
       if (x.name < y.name) return -1
       else return 1
      }
    );
    let minNumber = Math.min(...studyChannels.map((x) => x.position));
    for (let i = minNumber; i < (minNumber + studyChannels.length); i++){
      let currentChannel = studyChannels[i-minNumber];
      if (currentChannel.position != i){
        currentChannel.edit({position: i});
      }
    }

    // Incorrect arguments
    if (args.length == 0) {
      message.channel.send('You have successfully sorted the channels!');
      return;
    }
    if (args.length != 1) {
      message.channel.send('You need to give the name of the class!');
      return;
    }
    
    const newChannelName = args[0].toLowerCase();

    let textChannels = channels.array().filter(
      (x) => (x.type == 'text' && x.parentID == studyCategory.id
        && x.name == newChannelName)
    );

    // Check if this exists already
    if (textChannels.length != 0) {
      message.channel.send('Channel exists already!');
      return;
    }

    // Create a new role
    let classRole = roles.array().filter(
      (x) => x.name == newChannelName
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
      (x) => x.name == '@everyone'
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
