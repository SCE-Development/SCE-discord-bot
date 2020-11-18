const Discord = require('discord.js');
const Command = require('../Command');
const { THREAD_QUERY, CREATE_THREAD } = require('../../APIFunctions/thread');

module.exports = new Command({
  name: 'thread',
  description: 'View active threads or start a new one',
  category: 'custom threads',
  aliases: [],
  permissions: 'general',
  params: 'none (view threads), <topic> (start new thread)',
  example: 's!thread <topic (optional)>',
  execute: (message, args) => {
    const param = args.join(' ').trim();

    if (param.length === 0) {
      // Show all active threads
      const CURRENT_DATE = new Date();
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const checkIfActive = (message) =>
        (CURRENT_DATE - message.createdAt) / MS_PER_DAY < 7;
      const requestMessage = (id) =>
        message.channel.fetchMessage(id).then((response) => response);

      const getActiveThreads = async () => {
        const response = await THREAD_QUERY();
        const embed = new Discord.RichEmbed()
          .setTitle('Active Threads')
          .setDescription(
            'Use `|thread id|` to view the full thread or\
            `|thread id| <message>` to add to the thread'
          );

        for (let i = 0; i < response.responseData.length; i++) {
          const thread = response.responseData[i];

          let lastMessage = await requestMessage(
            thread.threadMessages[thread.threadMessages.length - 1].messageID
          );

          // Do not display messages older than a week old
          if (!checkIfActive(lastMessage)) {
            break;
          }
          const blurb = (
            lastMessage.member.displayName +
            ' on ' +
            lastMessage.createdAt.toLocaleDateString() +
            ', ' +
            lastMessage.content
          ).substring(0, 150);
          // Add the thread and display the last message
          if (thread.topic) {
            embed.addField(
              thread.topic + ' (id: ' + thread.threadID + ')',
              blurb
            );
          } else {
            embed.addField(' (id: ' + thread.threadID + ')', blurb);
          }
        }

        if (embed.fields.length === 0) {
          embed.setFooter('No active threads in this channel.');
        }

        return embed;
      };

      getActiveThreads()
        .then((embed) => message.channel.send(embed))
        .catch(() => message.channel.send('Oops! Could not query threads.'));
    } else {
      // Start new thread
      // todo generate threadID
      const threadID = '1';
      const createThread = async () =>
        await CREATE_THREAD({
          threadID: threadID,
          creatorID: message.member.id,
          guildID: message.guild.id,
          topic: param,
          messageID: message.id,
        });

      createThread().then((response) => {
        if (response.error) {
          message.channel.send('Oops! Could not create thread ' + param);
        } else {
          message.channel.send(
            new Discord.RichEmbed()
              .setTitle('New Thread')
              .setDescription(
                'Use `|thread id|` to view the full thread or\
                `|thread id| <message>` to add to the thread'
              )
              .addField('ID', response.responseData.id)
              .addField('Topic', response.responseData.topic)
          );
        }
      });
    }
  },
});
