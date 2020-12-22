const Discord = require('discord.js');
const Command = require('../Command');
const { gitCommands, npmCommands } = require('../../util/cli-commands');

function getEmbedColor(commandType) {
  switch (commandType) {
    case 'git': return 0xF1502F;
    case 'node':
    case 'npm': return 0xCB3837;
  }
}

function getTitleName(commandType) {
  switch (commandType) {
    case 'git': return 'git commands';
    case 'node':
    case 'npm': return 'npm commands';
  }
}

function getImageUrl(commandType) {
  switch (commandType) {
    case 'git':
      return 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png';
    case 'node':
    case 'npm':
      // eslint-disable-next-line
      return 'https://cdn.freebiesupply.com/logos/large/2x/npm-2-logo-png-transparent.png';
  }
}

function getCommandList(commandType) {
  switch (commandType) {
    case 'git': return gitCommands;
    case 'node':
    case 'npm': return npmCommands;
  }
}

module.exports = new Command({
  name: 'clihelp',
  description: 'List CLI commands and info about CLI commands',
  aliases: ['cli-commands'],
  example: 's!clihelp',
  permissions: 'general',
  category: 'information',
  execute: (message, args) => {
    if (!args.length) {
      const generalCliHelpEmbed = {
        color: 0xECB22E,
        author: {
          name: 'Welcome to SCEs CLI Helper',
          // eslint-disable-next-line
          icon_url: 'https://pngriver.com/wp-content/uploads/2018/04/Download-Cool-PNG-Photos.png',
        },
        description: 
          'Enter any of the following for information on CLI commands',
        fields: [
          { name: 'git', value: '`s!clihelp git`', inline: true },
          { name: 'npm', value: '`s!clihelp npm`', inline: true },
        ]
      };

      message.channel.send({ embed: generalCliHelpEmbed });
    } 
    else {
      const commandType = args[0].toLowerCase();
      // Needs pagination, niche case
      if (commandType === 'npm' || commandType === 'node') {
        let pageIndex = 0;
        const npmCommandEmbed = new Discord.RichEmbed()
          .setColor(getEmbedColor(commandType))
          .setAuthor(getTitleName(commandType), getImageUrl(commandType))
          .addField(npmCommands[pageIndex].name, npmCommands[pageIndex].value)
          .setFooter(`Page ${pageIndex + 1} of ${npmCommands.length}`);
        
        message.channel.send(npmCommandEmbed).then(async sentEmbed => {
          await sentEmbed.react('⬅️');
          await sentEmbed.react('➡️');

          const filter = (reaction, user) => {
            return ['⬅️', '➡️'].includes(reaction.emoji.name) 
              && user.id === message.author.id;
          };
          // Listens to reactions for 1 minute
          const collector =
            sentEmbed.createReactionCollector(filter, { time: 60000 });
          collector.on('collect', reaction => {
            reaction.remove(reaction.users.last().id);
            switch(reaction.emoji.name) {
              case '⬅️':
                if (pageIndex === 0) return;
                pageIndex--;
                break;
              case '➡️':
                if (pageIndex === npmCommands.length - 1) {
                  pageIndex = 0;
                } else {
                  pageIndex++;
                }
            }
            const newEmbed = new Discord.RichEmbed()
              .setColor(getEmbedColor(commandType))
              .setAuthor(getTitleName(commandType), getImageUrl(commandType))
              .addField(
                npmCommands[pageIndex].name,
                npmCommands[pageIndex].value
              )
              .setFooter(`Page ${pageIndex + 1} of ${npmCommands.length}`);

            sentEmbed.edit(newEmbed);
          });
        });
      }
      // Does not need pagination
      else {
        const cliHelpEmbed = {
          color: getEmbedColor(commandType),
          author: {
            name: getTitleName(commandType),
            // eslint-disable-next-line
            icon_url: getImageUrl(commandType),
          },
          fields: getCommandList(commandType)
        };

        message.channel.send({ embed: cliHelpEmbed });
      }     
    }
  }
});
