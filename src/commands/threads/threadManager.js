const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const Command = require('../Command');
const {
  CREATE_THREAD,
  DELETE_THREAD,
  THREAD_ID_QUERY,
} = require('../../APIFunctions/thread');

module.exports = new Command({
  name: 'threadmanager',
  description: 'Thread Manager. Used for managing custom threads.',
  aliases: ['tm'],
  example: 's!tm',
  permissions: 'admin',
  category: 'custom threads',
  params: '`create`, `remove`',
  execute: async (message, args) => {
    // Check for author permissions
    if (!isOfficer(message.member)) {
      message.channel.send(
        `${message.member}, you do not have sufficient permissions!`
      );
      return;
    }

    // Confirm action
    const confirmAction = async (create, info) => {
      const confirmEmbed = new Discord.RichEmbed();
      if (create) {
        confirmEmbed.setTitle('Start new thread?').addField('Topic', info[0]);
      } else {
        confirmEmbed.setTitle('Remove thread?').addField('ID', info[0]);
        if (info.length == 2) {
          confirmEmbed.addField('Topic', info[2]);
        }
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
        const confirmed = await confirmAction(true, [topic]);
        if (!confirmed) {
          return;
        }
        const threadID = message.createdTimestamp
          .toString()
          .split('')
          .reverse()
          .join('');

        const mutation = {
          threadID: threadID,
          creatorID: message.member.id,
          guildID: message.guild.id,
          messageID: message.id,
        };
        if (topic !== 'none') {
          mutation.topic = topic;
        }

        const response = await CREATE_THREAD(mutation);
        if (response.error) {
          // Error
          message.delete();
          message.channel
            .send(`Oops! Could not create thread ${topic}`)
            .then((msg) => {
              msg.delete(20000);
            });
          return;
        }
        message.channel.send(
          new Discord.RichEmbed()
            .setTitle('New Thread')
            .setDescription(
              'Use `|thread id|` to view the full thread or\
            `|thread id| <message>` to add to the thread.\n\
            Type at least 4 digits of the thread id.'
            )
            .addField('ID', threadID)
            .addField('Topic', topic)
        );
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
        let threadID = args.slice(1).join('').replace(/\s+/, '');
        if (!/^\d{1,18}/.test(threadID)) {
          // Invalid id
          message.channel
            .send(
              `Could not remove thread ${threadID}.
              ID should be a number up to 18 digits.`
            )
            .then((msg) => msg.delete(10000));
          return;
        }

        const query = await THREAD_ID_QUERY(threadID);

        if (query.error || query.responseData.length == 0) {
          // Error
          message.channel
            .send(`Oops! Could not remove thread with id ${threadID}.`)
            .then((msg) => msg.delete(10000));
          return;
        }
        if (query.responseData.length != 1) {
          // Too many threads
          message.channel
            .send(`Oops! Multiple threads matched id ${threadID}.`)
            .then((msg) => msg.delete(10000));
          return;
        }
        threadID = query.responseData[0].threadID;
        const info =
          query.responseData[0].topic === 'undefined'
            ? [threadID]
            : [threadID, query.responseData[0].topic];
        const confirmed = await confirmAction(false, info);
        if (!confirmed) {
          return;
        }

        const response = await DELETE_THREAD(threadID);
        if (response.error) {
          // Error
          message.channel
            .send(`Oops! Could not remove thread with id ${threadID}.`)
            .then((msg) => msg.delete(10000));
          return;
        }
        const removalMessage =
          response.responseData.topic === 'undefined'
            ? `Removed thread (id: ${response.responseData.threadID})`
            : `Removed thread ${
              response.responseData.topic
            } (id: ${
              response.responseData.threadID
            })`;
        message.channel.send(removalMessage);
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
