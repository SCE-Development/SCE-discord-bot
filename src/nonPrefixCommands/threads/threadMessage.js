const Discord = require('discord.js');
const Command = require('../Command');
const { prefix } = require('../../../config.json');
const { THREAD_QUERY } = require('../../APIFunctions/thread');
const {
  createNewThread,
  addMessageToThread,
  pagination,
  multipleThreadResults,
} = require('../../util/threadMessage');
const { decorateId, undecorateId } = require('../../util/ThreadIDFormatter');

module.exports = new Command({
  name: 'threadmessage',
  regex: new RegExp(/^\[[\d\s-]{4,20}\]/),
  description: 'View or add to a thread',
  example: '[thread ID] optional message',
  category: 'custom threads',
  permissions: 'general',
  execute: async message => {
    const input = /^\[([\d\s-]{4,20})\]\s*(.*)/.exec(message);
    const threadID = undecorateId(input[1]).substr(0, 13);
    const body = input[2].length === 0 ? null : input[2];

    if (threadID.length < 4) {
      // thread ID too short
      message.channel
        .send(`Error: ID ${decorateId(threadID)} must be at least 4 digits.`)
        .then(msg => msg.delete(10000).catch(() => null));
      return;
    }

    //  MESSAGE HANDLING
    const threadQuery = await THREAD_QUERY({
      threadID: threadID,
      guildID: message.guild.id,
      channelID: message.channel.id,
    });
    if (threadQuery.error) {
      message.channel
        .send(`Internal error searching for thread ${decorateId(threadID)}`)
        .then(msg => msg.delete(10000).catch(() => null));
      return;
    }

    // Special cases when there are 0, 1, or more than 1 thread responses
    switch (threadQuery.responseData.length) {
      case 0:
        if (body) {
          createNewThread(threadID, body, message);
        } else {
          const noResultEmbed = new Discord.RichEmbed()
            .setTitle('No results')
            .setDescription(
              `There may have been a typo, you can use \`${prefix}thread all\`
              to check if a thread starts with\
            \`${decorateId(threadID)}\` manually`
            );
          message.channel
            .send(noResultEmbed)
            .then(msg => msg.delete(30000).catch(() => null));
        }
        break;
      case 1:
        if (body) {
          addMessageToThread(message, threadQuery.responseData[0]);
        } else {
          const topic = threadQuery.responseData[0].topic;
          const templateEmbed = new Discord.RichEmbed()
            .setTitle('Thread')
            .setDescription('')
            .addField(
              'ID',
              decorateId(threadQuery.responseData[0].threadID),
              true
            )
            .addField('Topic', topic || 'none', true);
          pagination(templateEmbed, message, threadQuery.responseData);
        }
        break;
      default:
        multipleThreadResults(
          threadID,
          message,
          threadQuery.responseData,
          body
        );
    }
  },
});
