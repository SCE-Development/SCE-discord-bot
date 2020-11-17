const Discord = require('discord.js');
const Command = require('../Command');

module.exports = new Command({
  name: 'thread',
  description: 'View active threads or start a new one',
  category: 'custom threads',
  aliases: [],
  permissions: 'general',
  params: 'none (view threads), <topic> (start new thread)',
  example: 's!thread <topic (optional)>',
  execute: (message, args) => {
    message.content = args.join(' ').trim();

    if (message.content.length === 0) {
      // show all active threads
      const CURRENT_DATE = new Date();
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const checkIfActive = (message) =>
        (CURRENT_DATE - message.createdAt) / MS_PER_DAY < 7;
      const requestMessage = (id) => message.channel
        .fetchMessage(id)
        .then( (response) => response );
      // TODO implement query
      const response = {responseData: [
        {
          threadID: 1000,
          topic: 'Long Message',
          threadMessages: [{ messageID: '778111828462796810' }]
        },
        {
          threadID: 1001,
          topic: null,
          threadMessages: [{ messageID: '778127742109483008' }]
        },
        {
          threadID: 1002,
          topic: 'Old Message',
          threadMessages: [{ messageID: '770856956449652776' }]
        }
      ]};

      const makeEmbed = async () => {
        const embed = new Discord.RichEmbed()
          .setTitle('Active Threads')
          .setDescription(
            'Use `|thread id|` to view the full thread\
            or `|thread id| <message>` to add to the thread'
          );

        for (let i = 0; i < response.responseData.length; i++) {
          const thread = response.responseData[i];

          let lastMessage = await requestMessage(
            thread.threadMessages[thread.threadMessages.length - 1].messageID
          );
        
          // do not display messages older than a week old
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
          // add the thread and display the last message
          if (thread.topic) {
            embed.addField(
              thread.topic + ' (id: ' + thread.threadID + ')',
              blurb
            );
          } else {
            embed.addField(' (id: ' + thread.threadID + ')', blurb);
          }
        }

        return embed;
      };

      makeEmbed().then( (embed) => message.channel.send(embed) );
    } else {
      // start new thread
      // TODO implement query
      const response = { data: { threadID: 1000 } };
      const threadEmbed = new Discord.RichEmbed()
        .setTitle('New Thread')
        .setDescription('Use `|thread id|` to view the full thread\
        or `|thread id| <message>` to add to the thread')
        .addField('ID', response.data.threadID)
        .addField('Topic', message.content);
      message.channel.send(threadEmbed);
    }
  }
});
