const Discord = require('discord.js');
const Command = require('../Command');

module.exports = new Command({
  name: 'liststudychannels',
  description: 'List all available study channels',
  category: 'member services',
  aliases: ['lsc'],
  permissions: 'member',
  example: 's!lsc',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const { channels } = message.guild;

    const studyChannels = channels.array().filter(
      (x) => x.type == 'category' && x.name == 'study'
    );
    if (studyChannels.length == 0) {
      message.channel.send('Create a study category first!');
      return;
    }
    if (studyChannels.length > 1) {
      message.channel.send('Ambiguous command. Delete a study category first');
      return;
    }
    let studyChannel = studyChannels[0];
    let textChannels = channels.array().filter(
      (x) => (x.type == 'text' && x.parentID == studyChannel.id)
    );
    
    textChannels = textChannels.map((channel) => '`'+channel.name+'`');
    const listEmbed = new Discord.RichEmbed()
      .setTitle('List all the study channels')
      .setColor('#ccffff')
      .setDescription(textChannels.join('\n'));

    message.channel.send(listEmbed);
  },
});
