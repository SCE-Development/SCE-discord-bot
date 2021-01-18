const Discord = require('discord.js');
const { isOfficer } = require('../../util/Permission');
const { prefix } = require('../../../config.json');
const Command = require('../Command');
const {
  CREATE_THREAD,
  DELETE_THREAD,
  THREAD_QUERY,
} = require('../../APIFunctions/thread');
const {
  createIdByTime,
  decorateId,
  undecorateId,
} = require('../../util/ThreadIDFormatter');

module.exports = new Command({
  name: 'threadmanager',
  description: 'Thread Manager. Used for managing custom threads.',
  aliases: ['tm'],
  example: `${prefix}tm <create | remove> <[topic] | id>`,
  permissions: 'admin',
  category: 'custom threads',
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
        confirmEmbed
          .setTitle('Start new thread?')
          .addField('Topic', info[0], true);
      } else {
        confirmEmbed
          .setTitle('Remove thread?')
          .addField('ID', decorateId(info[0]), true);
        if (info.length === 2) {
          confirmEmbed.addField('Topic', info[1], true);
        }
      }
      const confirmMessage = await message.channel.send(confirmEmbed);
      confirmMessage
        .react('👍')
        .then(() => confirmMessage.react('👎'))
        .catch(() => null);

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
        .then(collected => {
          const reaction = collected.first();
          confirmMessage.delete().catch(() => null);
          if (reaction.emoji.name === '👍') {
            return true;
          } else {
            message.channel
              .send(cancelMessage)
              .then(msg => msg.delete(10000).catch(() => null));
            return false;
          }
        })
        .catch(() => {
          confirmMessage.delete().catch(() => null);
          message.channel
            .send(cancelMessage)
            .then(msg => msg.delete(10000).catch(() => null));
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
        const threadID = createIdByTime(message.createdAt);

        const mutation = {
          threadID: threadID,
          creatorID: message.member.id,
          guildID: message.guild.id,
          channelID: message.channel.id,
          messageID: message.id,
        };
        if (topic !== 'none') {
          mutation.topic = topic;
        }

        const response = await CREATE_THREAD(mutation);
        if (response.error) {
          // Error
          message.channel
            .send(`Oops! Could not create thread ${topic}`)
            .then(msg => {
              msg.delete(20000).catch(() => null);
            });
          return;
        }
        message.channel.send(
          new Discord.RichEmbed()
            .setTitle('New Thread')
            .setDescription(
              'Use `[thread id]` to view the full thread or\
              `[thread id] message` to add to the thread.\n\
              Type at least 4 digits of the thread id.'
            )
            .addField('ID', decorateId(threadID), true)
            .addField('Topic', topic, true)
        );
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
              .addField(
                `\`${prefix}tm remove <thread id>\``,
                'Removes a thread'
              )
              .addField('Aliases', 'rm')
          );
          return;
        }
        let threadID = undecorateId(args.slice(1).join(''));
        if (!/^\d+$/.test(threadID)) {
          // Invalid id
          message.channel
            .send(
              `Could not remove thread ${decorateId(threadID)}.
              ID should be a number up to 13 digits.`
            )
            .then(msg => msg.delete(10000).catch(() => null));
          return;
        }

        const query = await THREAD_QUERY({
          threadID,
          channelID: message.channel.id,
          guildID: message.guild.id,
        });
        if (query.error) {
          // Error
          message.channel
            .send(
              `Oops! Could not remove thread with id ${decorateId(threadID)}.`
            )
            .then(msg => msg.delete(10000).catch(() => null));
          return;
        }
        const threads = query.responseData;
        if (threads.length === 0) {
          // No threads
          message.channel
            .send(`Oops! Found no threads with id ${decorateId(threadID)}.`)
            .then(msg => msg.delete(10000).catch(() => null));
          return;
        }
        if (threads.length !== 1) {
          // Too many threads
          message.channel
            .send(`Oops! Multiple threads matched id ${decorateId(threadID)}.`)
            .then(msg => msg.delete(10000).catch(() => null));
          return;
        }
        threadID = threads[0].threadID;
        const info =
          threads[0].topic === null ? [threadID] : [threadID, threads[0].topic];
        const confirmed = await confirmAction(false, info);
        if (!confirmed) {
          return;
        }

        const response = await DELETE_THREAD({
          threadID,
          guildID: message.guild.id,
        });
        if (response.error) {
          // Error
          message.channel
            .send(
              `Oops! Could not remove thread with id ${decorateId(threadID)}.`
            )
            .then(msg => msg.delete(10000).catch(() => null));
          return;
        }
        const removalMessage =
          response.responseData.topic === null
            ? `Removed thread (id:
              ${decorateId(response.responseData.threadID)})`
            : `Removed thread ${response.responseData.topic}
              (id: ${decorateId(response.responseData.threadID)})`;
        message.channel.send(removalMessage);
        message.delete().catch(() => null);
        break;
      }

      default: {
        // Help
        message.channel.send(
          new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Thread Manager')
            .setDescription('Unrecognized paramter, try using:')
            .addField(
              `\`${prefix}tm create [topic]\``,
              'Creates a new thread - [topic] (optional)'
            )
            .addField(
              `\`${prefix}tm remove <thread id>\``,
              'Removes a thread - alias (rm)'
            )
        );
      }
    }
  },
});
