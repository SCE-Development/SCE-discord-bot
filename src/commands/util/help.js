const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const Command = require('../Command');

module.exports = new Command({
  name: 'help',
  description: 'List commands and info about commands',
  params: '`s!help [commandName]`',
  category: 'information',
  aliases: ['commands'],
  permissions: 'general',
  execute: (message, args) => {

    const author = message.member;
/*
    if (!isOfficer(author)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }
*/
    const capitalize = (message) => (message.charAt(0).toUpperCase()
      + message.slice(1));
    const { commands } = message.client;

    // list of categories
    const categories = (commands.map((command) => {
      if (command.permissions === 'admin' && !isOfficer(author)) {
        return;
      }
      return command.category;
    }))
      .filter((x, i, a) => a.indexOf(x) == i);
    // dictionary of categories
    let dict = {};

    if (!args.length) {
      const helpEmbed = new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle('All commands');
      for (let i = 0; i < categories.length; i++) {
        if (categories[i]) {
          dict[categories[i]] = [];
        }
      }
      // tmp is all the unique commands
      let tmp = Array.from(new Set(commands.array()));
      for (let j = 0; j < tmp.length; j++) {
        if (tmp[j].permissions === 'admin' && !isOfficer(author)) {
          continue;
        }

        dict[tmp[j].category].push(`\`${tmp[j].name}\``);
      }

      Object.entries(dict).forEach(([category, commands]) => {
        let commandString = commands.join(', ');
        let categoryString = capitalize(category);
        helpEmbed.addField(categoryString, commandString);
      });
      message.channel.send(helpEmbed);
    } else {
      let command = args[0].toLowerCase();
      
      // Grab command info
      const commandInfo = commands.get(command);
      
      if (!commandInfo){
        message.channel.send(`Command ${command} does not exist!`);
        return;
      }

      if (commandInfo.permissions === 'admin' && !isOfficer(author)) {
        message.channel.send(`You do not have permissions to use this command!`);
        return;
      }

      const helpEmbed = new Discord.RichEmbed()
        .setColor('#ccffff')
        .setTitle(capitalize(command));
      
      Object.entries(commandInfo).forEach(([field, info]) => {
        if (field == 'executeCommand' || !info || info.length == 0) return;
        let infoText = info;
        if (field == 'aliases') infoText = info.join(', ');
        if (field != 'name' && field != 'aliases' && field != 'example') {
          infoText = capitalize(infoText);
        }
        helpEmbed.addField(capitalize(field), infoText);
      });
      message.channel.send(helpEmbed);
    }
  }
});
