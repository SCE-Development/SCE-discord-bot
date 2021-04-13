const Discord = require('discord.js');
const Command = require('../Command');

module.exports = new Command({
  name: 'liststudychannels',
  description: 'List all available study channels',
  aliases: ['lsc'],
  example: 's!lsc',
  permissions: 'member',
  category: 'member services',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const { guild } = message;
    const { channels } = guild;

    const studyCategory = channels.cache.find(
      channel => channel.type === 'category' && channel.name === 'study'
    );
    if (!studyCategory) {
      message.channel.send('Create a study category first!');
      return;
    }

    let textChannels = channels.cache.array().filter(
      channel => (
        channel.type === 'text' && channel.parentID === studyCategory.id
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
    const listEmbed = new Discord.MessageEmbed()
      .setTitle('List all the study channels')
      .setColor('#ccffff')
      .setDescription(textChannels.join('\n'));

    message.channel.send(listEmbed);
  },
});
