const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const Command = require('../Command');
const { CREATE_THREAD, DELETE_THREAD } = require('../../APIFunctions/thread');

module.exports = new Command({
  name: 'threadmanager',
  description: 'Create and remove threads.',
  category: 'custom threads',
  aliases: ['tm'],
  permissions: 'admin',
  params: '`create`, `remove`',
  example: 's!tm <command> <param>',
  execute: (message, args) => {
    // Check for author permissions
    if (!isOfficer(message.member)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }

    switch (args[0]) {
      case 'create': {
        // Create a thread
        const topic = args.slice(1).join(' ');
        // todo generate threadID
        const threadID = '2';

        const createThread = async () =>
          await CREATE_THREAD({
            threadID: threadID,
            creatorID: message.member.id,
            guildID: message.guild.id,
            topic: topic,
            messageID: message.id,
          });

        createThread().then((response) => {
          if (response.error) {
            // Error
            message.channel.send('Oops! Could not create thread ' + topic);
            return;
          }
          message.channel.send(
            new Discord.RichEmbed()
              .setTitle('New Thread')
              .setDescription(
                'Use `|thread id|` to view the full thread or\
                `|thread id| <message>` to add to the thread'
              )
              .addField('ID', threadID)
              .addField('Topic', topic)
          );
        });
        break;
      }
      case 'remove':
      case 'rm': {
        // Remove a thread
        if (args.length < 2) {
          // Help
          message.channel.send(
            new Discord.RichEmbed()
              .setColor('#ccffff')
              .setTitle('Remove Thread')
              .addField('s!tm remove <thread id>', 'Removes a thread')
              .addField('Aliases', 'rm')
          );
          return;
        }

        const id = args.slice(1).join('').replace(/\s+/, '');

        if (!/^\d{1,18}/.test(id)) {
          // Invalid id
          message.channel.send(
            'Could not remove thread ' +
              id +
              '. ID should be a number up to 18 digits.'
          );
          return;
        }

        const removeThread = async () => await DELETE_THREAD({ threadID: id });

        removeThread().then((response) => {
          if (response.error) {
            // Error
            message.channel.send('Oops! Could not remove thread ' + id);
          } else {
            message.channel.send('Removed thread ' + id);
          }
        });
        break;
      }

      default: {
        // Help
        message.channel.send(
          new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Thread Manager')
            .setDescription('Unrecognized command, try using:')
            .addField(
              's!tm create <topic>',
              'Creates a new thread - <topic> (optional)'
            )
            .addField(
              's!tm remove <thread ID>',
              'Removes a thread - alias (rm)'
            )
        );
      }
    }
  },
});
