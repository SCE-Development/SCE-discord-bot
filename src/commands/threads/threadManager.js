const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const Command = require('../Command');
const { CREATE_THREAD, DELETE_THREAD } = require('../../APIFunctions/thread');

module.exports = new Command({
  name: 'threadmanager',
  description: 'Create and remove threads.',
  category: 'threads',
  aliases: ['tm'],
  permissions: 'admin',
  params: '`create`, `remove`',
  example: 's!tm <param> <option>',
  execute: (message, args) => {
    // Check for author permissions
    if (!isOfficer(message.member)) {
      message.channel.send('You do not have sufficient permissions!');
      return;
    }

    // Confirm action
    const confirmAction = async (create, param) => {
      const confirmEmbed = new Discord.RichEmbed();
      if (create) {
        confirmEmbed.setTitle('Start new thread?').addField('Topic', param);
      } else {
        confirmEmbed.setTitle('Remove thread?').addField('ID', param);
      }
      const confirmMessage = await message.channel.send(confirmEmbed);
      confirmMessage
        .react('👍')
        .then(() => confirmMessage.react('👎'))
        .catch(() => null /* User reacts before bot (message is deleted) */);

      const filter = (reaction, user) => {
        return (
          ['👍', '👎'].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      const cancelMessage = create
        ? 'New thread canceled'
        : 'Remove thread canceled';
      return await confirmMessage
        .awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
        .then((collected) => {
          const reaction = collected.first();
          confirmMessage.delete();
          if (reaction.emoji.name === '👍') {
            return true;
          } else {
            message.channel
              .send(cancelMessage)
              .then((msg) => msg.delete(10000));
            return false;
          }
        })
        .catch(() => {
          confirmMessage.delete();
          message.channel.send(cancelMessage).then((msg) => msg.delete(10000));
          return false;
        });
    };

    switch (args[0]) {
      case 'create': {
        // Create a thread
        let topic = args.slice(1).join(' ');
        if (topic.length === 0) {
          topic = 'none';
        }

        confirmAction(true, topic).then((confirmed) => {
          if (!confirmed) {
            message.delete();
            return;
          }
          // todo generate threadID
          const threadID = '2';

          const mutation = {
            threadID: threadID,
            creatorID: message.member.id,
            guildID: message.guild.id,
            messageID: message.id,
          };
          if (topic !== 'none') {
            mutation.topic = topic;
          }

          const createThread = async () => await CREATE_THREAD(mutation);

          createThread().then((response) => {
            if (response.error) {
              // Error
              message.delete();
              message.channel
                .send('Oops! Could not create thread ' + topic)
                .then((msg) => {
                  msg.delete(20000);
                });
            } else {
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
            }
          });
        });
        break;
      }
      case 'remove':
      case 'rm': {
        // Remove a thread
        message.delete();

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
          message.channel
            .send(
              'Could not remove thread ' +
                id +
                '. ID should be a number up to 18 digits.'
            )
            .then((msg) => msg.delete(10000));
          return;
        }

        confirmAction(false, id).then((confirmed) => {
          if (!confirmed) {
            return;
          }

          const removeThread = async () =>
            await DELETE_THREAD({ threadID: id });

          removeThread().then((response) => {
            if (response.error) {
              // Error
              message.channel
                .send('Oops! Could not remove thread ' + id)
                .then((msg) => msg.delete(10000));
            } else {
              const removalMessage =
                response.responseData.topic === 'undefined'
                  ? 'Removed thread (id: ' +
                    response.responseData.threadID +
                    ')'
                  : 'Removed thread ' +
                    response.responseData.topic +
                    ' (id: ' +
                    response.responseData.threadID +
                    ')';
              message.channel
                .send(removalMessage)
                .then((msg) => msg.delete(10000));
            }
          });
        });
        break;
      }

      default: {
        // Help
        message.delete();
        message.channel.send(
          new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Thread Manager')
            .setDescription('Unrecognized paramter, try using:')
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
