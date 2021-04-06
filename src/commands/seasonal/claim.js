const Discord = require('discord.js');
const Command = require('../Command');
const {QUERY_EGG, ADD_EGG} = require('../../APIFunctions/easterResponses');

module.exports = new Command({
  name: 'claim',
  description: 'Claim eggs in the egg hunt with a code',
  aliases: [],
  examples: 's!claim <code>',
  permissions: 'general',
  category: 'Seasonal Game',
  execute: async (message, args) => {
    const eggResponse = await QUERY_EGG({eggID: args[0]});
    if(eggResponse.error) {
      message.channel.send(new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle('Easter Egg Event!')
        .setDescription(args[0] + ' is not an Easter Egg!')
      ).then((msg) => {
        message.delete().catch(() => null);
        msg.delete(300000).catch(() => null);
      }); 
      return;
    }
    
    const response = await ADD_EGG({
      userID: message.member,
      eggID: args[0]
    });
    if(response.error) {
      message.channel.send(new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle('Easter Egg Event!')
        .setDescription('Error claiming egg! Maybe try again?')
      ).then((msg) => {
        message.delete().catch(() => null);
        msg.delete(300000).catch(() => null);
      });
      return;
    }
    message.channel.send(new Discord.RichEmbed()
      .setColor('#ccffff')
      .setTitle('East Egg Event!')
      .setDescription('You have claimed the easter egg!')
    ).then((msg) => {
      message.delete().catch(() => null);
      msg.delete(300000).catch(() => null);
    });
  }
});
