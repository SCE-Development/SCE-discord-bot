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

    const studyCategory = channels.array().filter(
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
    let studyChannel = studyCategory[0];
    let textChannels = channels.array().filter(
      (channel) => (
        channel.type == 'text' && channel.parentID == studyChannel.id
      )
    );
    textChannels = textChannels.map((channel) => '`' + channel.name + '`');
    textChannels.sort((channel1, channel2) => {
      let channel1prefix = channel1.match(/\D{2,3}/);
      let channel2prefix = channel2.match(/\D{2,3}/);
      if (channel1prefix < channel2prefix) {
        return -1;
      } else if (channel1prefix > channel2prefix) {
        return 1;
      } else {
        let channel1suffix = channel1.match(/\d{2,3}/);
        let channel2suffix = channel2.match(/\d{2,3}/);
        if (Number(channel1suffix) < Number(channel2suffix)) return -1;
        else return 1;
      }
    });
    const listEmbed = new Discord.RichEmbed()
      .setTitle('List all the study channels')
      .setColor('#ccffff')
      .setDescription(textChannels.join('\n'));

    message.channel.send(listEmbed);
  },
});
