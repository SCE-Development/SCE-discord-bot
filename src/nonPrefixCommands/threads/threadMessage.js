const Discord = require('discord.js');
const Command = require('../Command');
const { prefix } = require('../../../config.json');
const {
  THREAD_ID_QUERY,
  CREATE_THREAD,
  ADD_THREADMESSAGE,
  DELETE_THREADMESSAGE,
  DELETE_THREAD,
} = require('../../APIFunctions/thread');

/**
 * @typedef   {Object}    Data
 *
 * @property  {String}    threadID        The ID of the thread.
 * @property  {String}    messageID       The message ID of the message.
 * @property  {String}    [topic]         The topic of the thread.
 * @property  {String}    creatorID       The user ID of the creator.
 * @property  {String}    channelID       The ID of the channel.
 * @property  {String}    guildID         The ID of the guild.
 * @property  {String}    [threadMsg]     The message the user typed
 */

module.exports = new Command({
  name: 'threadmessage',
  regex: new RegExp(/^\|\s*(\d{4,13})\s*\|/),
  description: 'Create or add to a thread with an ID',
  example: '|<thread ID>| [message]',
  category: 'custom threads',
  permissions: 'general',
  execute: async message => {
    /**
     * @const {Boolean} createMode
     * @description
     * True = User is creating thread or adding message to thread
     *
     * False = User looking at threads with starting ID
     */
    const createMode = /^\|\s*(\d{4,13})\s*\|\s*(.+)/.test(message);
    /**
     * @description
     * Object containing all necessary data to use
     * any APIFunction
     * @type {Data}
     */
    const data = {
      threadID: /^\|\s*(\d{4,13})\s*\|/.exec(message)[1],
      messageID: message.id,
      topic: createMode
        ? /^\|\s*(\d{4,13})\s*\|\s*(.{0,100})/.exec(message)[2]
        : null,
      creatorID: message.author.id,
      channelID: message.channel.id,
      guildID: message.guild.id,
      threadMsg: createMode
        ? /^\|\s*(\d{4,13})\s*\|\s*(.+)/.exec(message)[2]
        : null,
    };

    //  MESSAGE HANDLING
    let threadQuery = await THREAD_ID_QUERY(data);
    if (threadQuery.error) {
      let errorEmbed = Discord.RichEmbed()
        .setTitle('Error!')
        .setDescription(`Error searching for thread ${data.threadID}`);
      message.channel
        .send(errorEmbed)
        .then(msg => msg.delete(100000).catch(() => null));
      return;
    }

    let templateEmbed = new Discord.RichEmbed()
      .setColor('#301934')
      .setTitle(`All threads that start with ID: ${data.threadID}`)
      .setDescription('Choose one! Example: type "1"');
    // Special cases when there are 0, 1, or more than 1 thread responses
    switch (threadQuery.responseData.length) {
      case 0:
        if (createMode) {
          createNewThread(data, message, data.threadMsg);
        } else {
          let noResultEmbed = new Discord.RichEmbed()
            .setTitle('No results')
            .setDescription(
              `There may have been a typo, you can use \`${prefix}thread all\`\
            to check if a thread starts with \`${data.threadID}\` manually`
            );
          message.channel
            .send(noResultEmbed)
            .then(msg => msg.delete(120000).catch(() => null));
        }
        break;
      case 1:
        if (createMode)
          addMessageToThread(data, message, threadQuery, data.threadMsg);
        else {
          let topic = threadQuery.responseData[0].topic;
          templateEmbed
            .setTitle('Thread')
            .setDescription('')
            .addField('ID', threadQuery.responseData[0].threadID, true)
            .addField('Topic', topic === null ? 'none' : topic, true);
          pagination(templateEmbed, message, threadQuery.responseData, true);
        }
        break;
      default:
        multipleThreadResults(
          data,
          message,
          threadQuery,
          createMode,
          data.threadMsg
        );
    }
  },
});

/**
 * @param {import('../threads/threadMessage').Data} data
 */
async function createNewThread(data, message, threadMsg) {
  if (threadMsg.length > 130) {
    let warningEmbed = new Discord.RichEmbed().setTitle('Warning')
      .setDescription(`The topic is too long for a new thread.
        If the intention was to add a message to a thread starting\
        with \`${data.threadID}\`, there is no such thread`);
    message.channel.send(warningEmbed);
    return;
  }
  const confirmAction = async topic => {
    const confirmEmbed = new Discord.RichEmbed();
    confirmEmbed.setTitle('Start new thread?').addField('Topic', topic);
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

    return await confirmMessage
      .awaitReactions(filter, { max: 1, time: 300090, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        confirmMessage.delete().catch(() => null);
        return reaction.emoji.name === '👍';
      })
      .catch(() => {
        confirmMessage.delete().catch(() => null);
        message.channel
          .send('Not created')
          .then(msg => msg.delete(10000).catch(() => null));
        return false;
      });
  };

  const confirmed = await confirmAction(data.topic);
  if (!confirmed) {
    message.channel
      .send('Not created')
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  const autogenID = message.createdTimestamp
    .toString()
    .split('')
    .reverse()
    .join('');
  //  flips the time stamp
  data.threadID = data.threadID + autogenID.substr(data.threadID.length);
  const createThread = await CREATE_THREAD(data);
  if (createThread.error) {
    message.channel
      .send('Error creating')
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  const threadCreateEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle('New Thread')
    .setDescription(
      `
        Use \`|thread id|\` to view the full thread or\
        \`|thread id|\` <message> to add to
        the thread.
        Type at least 4 digits of the thread id.
        (If thread ID is a new ID, the <message>\
        will be the topic of the new thread)`
    )
    .addField('ID', `${createThread.responseData.threadID}`, true)
    .addField('Topic', `${createThread.responseData.topic}`, true)
    .setTimestamp(message.createdAt.toLocaleString());
  message.channel.send(threadCreateEmbed);
}

/**
 * @param {import('../threads/threadMessage').Data} data
 * @param {Discord.Message} message
 * @param {import('../../APIFunctions/thread').ThreadOnePayload} threadQuery
 */
async function addMessageToThread(data, message, threadQuery, threadMsg) {
  //  We're adding in a message to the ID that was searched
  data.threadID = threadQuery.responseData[0].threadID;
  data.topic = threadQuery.responseData[0].topic;
  const addMsg = await ADD_THREADMESSAGE(data);
  if (addMsg.error) {
    message.channel
      .send('Error adding')
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  const addedEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle('New Message')
    .setDescription(
      `Use \`|thread id|\` to view the full thread or\
      \`|thread id|\` <message> to add to the thread.
      Type at least 4 digits of the thread id.
      (If thread ID is a new ID, the <message>\
      will be the topic of the new thread)`
    )
    .addField('ID', data.threadID, true)
    .addField('Topic', data.topic === null ? 'none' : data.topic, true)
    .addField('Added Message', threadMsg)
    .setTimestamp(message.createdAt.toLocaleString());
  await message.channel
    .send(addedEmbed)
    .then(msg => msg.delete(300000).catch(() => null));
}

/**
 * @param {import('../threads/threadMessage').Data} data
 * @param {Discord.Message} message the original message that started this
 * command
 * @param {import('../../APIFunctions/thread').ThreadOnePayload} threadQuery
 * @param {Boolean} createMode chooses how to deal with the data
 **/
async function multipleThreadResults(
  data,
  message,
  threadQuery,
  createMode,
  threadMsg
) {
  let templateEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle(`All threads that start with ID: ${data.threadID}`)
    .setDescription('Choose one! Example: type "1"');

  let emojiCollector = await pagination(
    templateEmbed,
    message,
    threadQuery.responseData,
    true
  );

  /**
   * Create Message collector filter
   * @param {Discord.Message} m message collected by discord
   * new filter for message collector
   * @param {Discord.User} user
   * @return {Boolean}
   * if message is a number,
   * is less than array length, and is a positive number
   * AND same message author ID
   * return true
   */

  let filter = m => {
    let goodChoice = /^(\d+)\s*$/.exec(m.content);
    if (goodChoice) {
      const index = parseInt(goodChoice[0]) - 1;
      goodChoice = index >= 0 && index < threadQuery.responseData.length;
    }
    return goodChoice && m.author.id === message.author.id;
  };
  /**
   * Create Message collector with filter
   * @description
   * Will only be active for 5 minutes (300000 ms)
   *
   * Will only collect message with valid messages
   * @see filter
   **/

  const messageCollector = message.channel.createMessageCollector(filter, {
    time: 300000,
  });

  /**
   * Action that happens when the actionlistener is called.
   * @param {Discord.Message} messageIn message collected by the collector
   * @see messageCollector
   */
  const collectMessage = async messageIn => {
    messageIn.delete().catch(() => null);
    // Get user's choice
    let index = parseInt(messageIn.content) - 1;
    // get the ThreadID that the user chose
    data.threadID = threadQuery.responseData[index].threadID;
    // get new query
    let threadQuery2 = await THREAD_ID_QUERY(data);
    if (emojiCollector !== null) {
      emojiCollector.stop(['The user has chosen a new threadID']);
    }
    /**
     * createMode = true
     * means user is looking for new messages so
     * it makes a page displaying the messages of the thread
     * false
     * User is trying to add a message to a thread
     */
    if (createMode) addMessageToThread(data, message, threadQuery2, threadMsg);
    else {
      let topic = threadQuery.responseData[index].topic;
      templateEmbed
        .setTitle('Thread')
        .setDescription('')
        .addField('ID', threadQuery.responseData[index].threadID, true)
        .addField('Topic', topic === null ? 'none' : topic, true);
      pagination(templateEmbed, message, threadQuery2.responseData, true);
    }
  };
  // collect only one message.
  messageCollector.once('collect', collectMessage);
}

/**
 * @typedef   {Object}    Page
 *
 * @property  {Number}    upperBound      upper bound of the whole list of items
 * @property  {Number}    lowerBound      lower bound of the whole list of items
 * @property  {Number}    currentPage     The current page
 * @property  {Number}    maxPage         Maximum amount of pages
 * @property  {Number}    ITEM_PER_PAGE   Number of items per page
 */

/**
 * @param {Discord.RichEmbed} templateEmbed
 * template containing Title, Description, and color that
 * the pages will follow
 * @param {Discord.Message} message
 * Message that was sent to start this command
 * @param {import('../../APIFunctions/thread').Thread} threads
 * An array containing ALL items that will be displayed in the "book"
 * @param {Boolean} messageMode
 * @param {Number} itemsPerPage
 * @return {Promise<Discord.ReactionCollector>}
 */
async function pagination(
  templateEmbed,
  message,
  threads,
  messageMode,
  itemsPerPage = 5
) {
  /**
   * @description
   * all necessary values needed to traverse through
   * the "book" of data
   * @type {Page}
   */
  let page = {
    upperBound: itemsPerPage,
    lowerBound: 0,
    currentPage: 0,
    maxPage: Math.ceil(threads.length / itemsPerPage) - 1,
    ITEM_PER_PAGE: itemsPerPage,
  };

  /**
   * @description
   * The "book" of data, each array index holds one page.
   * This variable is a collection of pages - a book.
   * @type {Discord.RichEmbed[]}
   */
  let threadListEmbed = new Array(page.maxPage + 1);
  /**
   * if the given array is length one, grab the messages
   * from the thread instead
   */

  if (threads.length === 1) {
    // new maxpage is made from the amount of threadMessages
    page.maxPage =
      Math.ceil(threads[0].threadMessages.length / itemsPerPage) - 1;
    if (page.maxPage === -1) {
      templateEmbed.setDescription('This thread has no messages');
    }
    threadListEmbed = new Array(page.maxPage + 1);
    threadListEmbed[0] = await createMessageEmbed(
      threads[0].threadMessages,
      templateEmbed,
      page,
      message,
      threads[0]
    );
  } else {
    threadListEmbed[0] = await createThreadEmbed(
      threads,
      templateEmbed,
      page,
      messageMode,
      message
    );
  }
  let currentMsg = await message.channel.send(
    threadListEmbed[page.currentPage]
  );
  // if more than 1 maxPage (not 0) then add transition emojis
  if (page.maxPage === 0) {
    return null;
  }
  /**
   * Create Message collector filter
   * @param {Discord.Reaction} reaction message collected by discord
   * new filter for message collector
   * @param {Discord.User} user
   * @return {Boolean}
   * if '⬅️' or '➡️' is reacted AND
   * author ID's match, then return true
   */

  let filter = (reaction, user) => {
    return (
      ['⬅️', '➡️'].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
  /**
   * Create Reaction collector with filter
   * @description
   * Will only be active for 5 minutes (30000 ms)
   *
   * Will only collect reaction with valid reactions
   * @see filter
   **/

  const emojiCollector = currentMsg.createReactionCollector(filter, {
    time: 300000,
  });

  /**
   * Action that happens when the actionlistener is called.
   * @param {Discord.Reaction} reaction reaction collected by the collector
   * @see messageCollector
   */
  const checkEmoji = async reaction => {
    // Handles what the current page is
    switch (reaction.emoji.name) {
      case '➡️':
        if (page.currentPage < page.maxPage) page.currentPage++;
        else page.currentPage = 0;
        break;
      case '⬅️':
        if (page.currentPage > 0) page.currentPage--;
        else page.currentPage = page.maxPage;
        break;
    }
    // Some math to identify lower and upper bound
    page.lowerBound = page.currentPage * itemsPerPage;
    page.upperBound = (page.currentPage + 1) * itemsPerPage;
    if (threadListEmbed[page.currentPage] === undefined) {
      if (threads.length === 1) {
        threadListEmbed[page.currentPage] = await createMessageEmbed(
          threads[0].threadMessages,
          templateEmbed,
          page,
          message,
          threads[0]
        );
      } else {
        threadListEmbed[page.currentPage] = await createThreadEmbed(
          threads,
          templateEmbed,
          page,
          messageMode,
          message
        );
      }
    }
    currentMsg.edit(threadListEmbed[page.currentPage]).catch(() => null);
    reaction.remove(reaction.users.last().id).catch(() => null);
  };
  // turn on the collector
  emojiCollector.on('collect', checkEmoji);
  await currentMsg.react('⬅️');
  await currentMsg.react('➡️');
  emojiCollector.on('end', () => {
    currentMsg.delete(120000).catch(() => null);
  });
  return emojiCollector;
}

/**
 * Creates a page that lists out threads.
 * @param {Discord.RichEmbed} templateEmbed
 * template containing Title, Description, and color that
 * the pages will follow
 * @param {import('../../APIFunctions/thread').Thread} threads
 * An array containing ALL items that will be displayed in the "book"
 * @param {Page} page
 * @param {Boolean} messageMode
 * @return {Promise<Discord.RichEmbed>}
 */
async function createThreadEmbed(
  threads,
  templateEmbed,
  page,
  messageMode,
  message
) {
  let outputEmbed = new Discord.RichEmbed()
    .setTitle(templateEmbed.title)
    .setColor(templateEmbed.color);
  if (messageMode) outputEmbed.setDescription(templateEmbed.description);
  for (const [index, thread] of threads
    .slice(page.lowerBound, page.upperBound)
    .entries()) {
    let j = thread.threadMessages.length;
    let lastMessage = null;
    while (lastMessage === null && j-- > 0) {
      const threadMessage = thread.threadMessages[j];
      lastMessage = await message.channel
        .fetchMessage(threadMessage.messageID)
        .catch(() => {
          DELETE_THREADMESSAGE({
            threadID: thread.threadID,
            guildID: thread.guildID,
            messageID: threadMessage.messageID,
          });
          return null;
        });
    }
    if (lastMessage === null) {
      DELETE_THREAD({ threadID: thread.threadID, guildID: thread.guildID });
    } else {
      let author = lastMessage.author.username;
      let currentIndex = page.currentPage * page.ITEM_PER_PAGE + index + 1;
      outputEmbed.addField(
        `${currentIndex}. ${thread.topic} (id: ${thread.threadID})`,
        `${author} on ${message.createdAt.toLocaleString()}\n${
          lastMessage.content
        }`.substring(0, 150)
      );
    }
  }
  if (page.maxPage > 0)
    outputEmbed.setFooter(
      `Page ${page.currentPage + 1} of ${page.maxPage + 1}`
    );
  return outputEmbed;
}

/**
 * Creates a page that lists out thread messages inside a thread.
 * @param {Discord.RichEmbed} templateEmbed
 * template containing Title, Description, and color that
 * the pages will follow
 * @param {import('../../APIFunctions/thread').Thread} threads
 * An array containing ALL items that will be displayed in the "book"
 * @param {Page} page
 * @param {Boolean} messageMode
 * @return {Promise<Discord.RichEmbed>}
 */
async function createMessageEmbed(
  threads,
  templateEmbed,
  page,
  message,
  ogThread
) {
  let outputEmbed = new Discord.RichEmbed()
    .setTitle(templateEmbed.title)
    .setColor(templateEmbed.color)
    .setDescription(templateEmbed.description);
  for (const field of templateEmbed.fields)
    outputEmbed.addField(field.name, field.value, field.inline);
  let messageManager = message.channel;
  for (const message of threads.slice(page.lowerBound, page.upperBound)) {
    // Get the message and trim the command off
    await messageManager
      .fetchMessage(message.messageID)
      .then(async content => {
        let nonPrefixCheck = /^\|\s*(\d{4,13})\|/.test(content.content);

        let trimmedMessage = '';
        if (nonPrefixCheck)
          trimmedMessage = /^\|\s*(\d{4,13})\s*\|\s*(.+)/.exec(
            content.content
          )[2];
        else {
          let trimmer = new RegExp('^' + prefix + 'thread\\s*(.+)');
          trimmedMessage = trimmer.exec(content.content)[1];
        }
        outputEmbed.addField(
          `${content.author.username} on ${content.createdAt.toLocaleString()}`,
          `${trimmedMessage}`
        );
      })
      .catch(async () => {
        DELETE_THREADMESSAGE({
          threadID: ogThread.threadID,
          guildID: ogThread.guildID,
          messageID: message.messageID,
        });
      });
  }
  if (page.maxPage > 0)
    outputEmbed.setFooter(
      `Page ${page.currentPage + 1} of ${page.maxPage + 1}`
    );
  return outputEmbed;
}
