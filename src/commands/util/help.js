const Discord = require('discord.js');
const Command = require('../Command');

module.exports = new Command({
  name: 'help',
  description: 'List commands and info about commands',
  category: 'information',
  aliases: ['commands'],
  permissions: 'general',
  execute: (message, args) => {
    const { commands } = message.client;
    //list of categories
    const categories = (commands.map(command => command.category))
      .filter((x, i, a) => a.indexOf(x) == i);
    //dictionary of categories
    var dict = {};

    if (!args.length) {
      //data.push('Here\'s a list of all my commands:');
      const helpEmbed = new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle('All commands');
      for (let i = 0; i < categories.length; i++) {
        dict[categories[i]] = '';
      }
      for (let i = 0; i < categories.length; i++) {
        let tmp = commands.array();
        for (let j = 0; j < tmp.length; j++) {
          if (tmp[j].category == categories[i]) {
            dict[categories[i]] += tmp[j].name + ', ';
          }
        }
        //message.channel.send("c " + coms)
        dict[categories[i]] = dict[categories[i]]
          .substring(0, dict[categories[i]].length - 2);
        helpEmbed.addField(categories[i], dict[categories[i]]);
      }

      message.channel.send(helpEmbed);


    } else {
      console.log('hi');
    }
  }
});
