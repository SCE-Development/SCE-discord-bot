const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const Command = require('../Command');

module.exports = new Command({
  name: 'help',
  description: 'List commands and info about commands',
  aliases: ['commands'],
  example: 's!help [commandName]',
  permissions: 'general',
  category: 'information',
  execute: (message, args) => {

    const author = message.member;

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
        .setAuthor('All commands', 'https://cdn.discordapp.com/emojis/718330337071071323.png?v=1');
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
        let categoryString = '';

        if (category == 'Server management') categoryString += ':scales: ';
        else if (category == 'mod') categoryString += ':crown: ';
        else if (category == 'github') categoryString += ':computer: ';
        else if (category == 'member services') {
          categoryString += ':badminton: ';
        }
        else if (category == 'custom threads') categoryString += ':thread: ';
        else if (category == 'information') categoryString += ':pushpin: ';

        categoryString += capitalize(category);
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
        message.channel
          .send('You do not have permissions to use this command!');
        return;
      }

      const helpEmbed = new Discord.RichEmbed()
        .setColor('#ccffff');
      let noAlias = true;

      Object.entries(commandInfo).forEach(([field, info]) => {
        if (field == 'executeCommand' || !info || info.length == 0) return;
        let infoText = info;
        
        if (field == 'name') {
          helpEmbed.setAuthor(capitalize(infoText), 'https://cdn.discordapp.com/emojis/718330337071071323.png?v=1');
          return;
        } else if (field == 'aliases') {
          infoText = info.join(', ');
          noAlias = false;
        }
        if (field != 'name' && field != 'aliases' && field != 'example') {
          infoText = capitalize(infoText);
        }

        if (field == 'description') {
          helpEmbed.addField(capitalize(field), infoText, false);
          return;
        } else if (field == 'example') {
          if (!noAlias) helpEmbed.addField('\u200b', '\u200b', true);
          helpEmbed.addField(capitalize(field), '`' + infoText + '`', true);
          return;
        } else if (field == 'permissions' && noAlias) {
          helpEmbed.addField('\u200b', '\u200b', true);
          helpEmbed.addField('\u200b', '\u200b', true);
        } else if (field == 'category') {
          helpEmbed.addField('\u200b', '\u200b', true);
        }

        helpEmbed.addField(capitalize(field), infoText, true);
      });
      message.channel.send(helpEmbed);
    }
  }
});
