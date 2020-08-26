const Discord = require('discord.js');
const Command = require('../Command');

module.exports = new Command({
  name: 'help',
  description: 'List commands and info about commands',
  params: '`s!help [commandName]`',
  category: 'information',
  aliases: ['commands'],
  permissions: 'general',
  execute: (message, args) => {

    const capitalize = (message) => (message.charAt(0).toUpperCase()
      + message.slice(1));
    const { commands } = message.client;
    // list of categories
    const categories = (commands.map(command => command.category))
      .filter((x, i, a) => a.indexOf(x) == i);
    // dictionary of categories
    let dict = {};

    if (!args.length) {
      const helpEmbed = new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle('All commands');
      for (let i = 0; i < categories.length; i++) {
        dict[categories[i]] = [];
      }
      let tmp = Array.from(new Set(commands.array()));
      for (let j = 0; j < tmp.length; j++) {
        dict[tmp[j].category].push(tmp[j].name);
      }

      Object.entries(dict).forEach(([category, commands]) => {
        let commandString = commands.join(', ');
        commandString = capitalize(commandString);
        let categoryString = capitalize(category);
        helpEmbed.addField(categoryString, commandString);
      });
      message.channel.send(helpEmbed);
    } else {
      let command = args[0].toLowerCase();
      const helpEmbed = new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle(capitalize(command));
      // Grab command info
      const commandInfo = commands.get(command);
      Object.entries(commandInfo).forEach(([field, info]) => {
        if (field == 'executeCommand' || !info || info.length == 0) return;
        let infoText = info;
        if (field == 'aliases') infoText = info.join(', ');
        if (field != 'name' && field != 'aliases'){
          infoText = capitalize(infoText);
        }
        helpEmbed.addField(capitalize(field), infoText);
      });
      message.channel.send(helpEmbed);
    }
  }
});
