const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const Command = require('../Command');

module.exports = new Command({
  name: 'threadmanager',
  description: 'Create and remove threads.',
  category: 'custom threads',
  aliases: ['tm'],
  permissions: 'admin',
  params: '`create`, `remove`',
  example: 's!tm <command> <param>',
  execute: (message, args) => {
    const author = message.member;
    // Check for author permissions
    if (!isOfficer(author)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }
    
    switch(args[0]) {
      case 'create': {
        // Create a thread
        const topic = args.slice(1).join(' ');
        // TODO implement mutation
        const response = { data: { threadID: 1000 } };
        const threadEmbed = new Discord.RichEmbed()
          .setTitle('Created new thread')
          .setDescription('Use `|thread id|` to view the full thread\
          or `|thread id| <message>` to add to the thread')
          .addField('id', response.data.threadID);
        // check if there's a topic
        if (topic.length > 0) {
          threadEmbed.addField('topic', topic);
        }
        message.channel.send(threadEmbed);
        break;
      }
      case 'remove':
      case 'rm': {
        // check if a thread id was supplied
        if (args.length < 2) {
          message.channel.send(new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Remove Thread')
            .addField('s!tm remove <thread id>', 'Removes a thread')
            .addField('Aliases', 'rm'));
          return;
        }
        const id = args.slice(1).join('').replace(/\s+/, '');
        if (!/^\d{1,18}/.test(id)) {
          message.channel.send(
            'Could not remove thread '+
            id +
            '. ID should be a number up to 18 digits.'
          );
          return;
        }
        // TODO implment mutation
        const response = { error: true };
        if (response.error) {
          message.channel.send(
            'Error removing thread ' + id + '. Perhaps there is a typo?'
          );
        } else {
          message.channel.send('Removed thread ' + id);
        }
        break;
      }

      default: {
        // Help
        message.channel.send(
          new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Thread Manager')
            .setDescription('Unrecognized command, try using:')
            .addField('s!tm create <topic>',
              'Creates a new thread - <topic> (optional)')
            .addField('s!tm remove <thread ID>',
              'Removes a thread - alias (rm)')
        );
      }
    }
  }
});
