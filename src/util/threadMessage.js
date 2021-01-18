const Discord = require('discord.js');
const {
  THREAD_QUERY,
  CREATE_THREAD,
  ADD_THREADMESSAGE,
  DELETE_THREADMESSAGE,
  DELETE_THREAD,
} = require('../APIFunctions/thread');
const { createIdByTime, decorateId } = require('./ThreadIDFormatter');

/**
 * @typedef {Object} Thread
 *
 * @property {String} threadID The ID of the thread.
 * @property {String} creatorID The user ID of the creator.
 * @property {String} guildID The ID of the guild.
 * @property {String} channelID The ID of the channel.
 * @property {String} [topic] The topic of the thread.
 * @property {String[]} threadMessages The IDs of messages in the thread.
 */

/**
 * @typedef   {Object}    Page
 *
 * @property  {Number}    upperBound      upper bound of the whole list of items
 * @property  {Number}    lowerBound      lower bound of the whole list of items
 * @property  {Number}    currentPage     The current page
 * @property  {Number}    maxPage         Maximum amount of pages
 * @property  {Number}    itemsPerPage   Number of items per page
 */

/**
 * Creates a new thread and alerts user.
 *
 * @param {String} threadID The desired thread ID.
 * @param {String} topic The topic for the thread.
 * @param {Discord.Message} message The invoking message.
 */
async function createNewThread(threadID, topic, message) {
  if (topic.length > 130) {
    message.channel
      .send(
        `The topic is too long for a new thread.
      If the intention was to add a message to a thread starting
      with \`${decorateId(threadID)}\`, there is no such thread`
      )
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  const confirmAction = async topic => {
    const confirmEmbed = new Discord.RichEmbed()
      .setTitle('Start new thread?')
      .addField('Topic', topic);
    const confirmMessage = await message.channel.send(confirmEmbed);
    confirmMessage
      .react('👍')
      .then(() => confirmMessage.react('👎'))
      .catch(() => null);
    const filter = (reaction, user) => {
      return (
        ['👍', '👎'].includes(reaction.emoji.name) &&
        user.id === message.member.id
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

  const confirmed = await confirmAction(topic);
  if (!confirmed) {
    message.channel
      .send('Not created')
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  //  flips the time stamp
  threadID =
    threadID + createIdByTime(message.createdAt).substr(threadID.length);
  const createThread = await CREATE_THREAD({
    threadID: threadID,
    creatorID: message.member.id,
    guildID: message.guild.id,
    channelID: message.channel.id,
    topic: topic,
    messageID: message.id,
  });
  if (createThread.error) {
    message.channel
      .send(
        `Error creating. Possibly an existing thread uses ID
        ${decorateId(threadID)}.`
      )
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  const threadCreateEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle('New Thread')
    .setDescription(
      'Use `[thread id]` to view the full thread or\
      `[thread id] message` to add to the thread.\
      Type at least 4 digits of the thread id.'
    )
    .addField('ID', `${decorateId(createThread.responseData.threadID)}`, true)
    .addField('Topic', `${createThread.responseData.topic}`, true)
    .setTimestamp(message.createdAt.toLocaleString());
  message.channel.send(threadCreateEmbed);
}

/**
 * Add a message to a thread and alert user.
 *
 * @param {Discord.Message} message The added message.
 * @param {Thread} thread Thread to add on.
 */
async function addMessageToThread(message, thread) {
  const addMsg = await ADD_THREADMESSAGE({
    threadID: thread.threadID,
    guildID: thread.guildID,
    messageID: message.id,
  });
  if (addMsg.error) {
    message.channel
      .send('Internal error adding message')
      .then(msg => msg.delete(10000).catch(() => null));
    return;
  }
  const addedEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle('New Message')
    .setDescription(
      'Use `[thread id]` to view the full thread or\
      `[thread id] message` to add to the thread.\
      Type at least 4 digits of the thread id.'
    )
    .addField('ID', decorateId(thread.threadID), true)
    .addField('Topic', thread.topic || 'none', true)
    .addField('Added Message', message.content);
  await message.channel
    .send(addedEmbed)
    .then(msg => msg.delete(300000).catch(() => null));
}

/**
 * Handles when there are multiple threads.
 *
 * @param {String} threadID The requested thread ID.
 * @param {Discord.Message} message The invoking message.
 * @param {Thread[]} threads The threads to handle.
 * @param {Boolean} createMode If the user is creating a thread or adding a
 * message.
 **/
async function multipleThreadResults(threadID, message, threads, createMode) {
  const templateEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle(`All threads that start with ID: ${decorateId(threadID)}`)
    .setDescription('Choose one! Example: type `1`');

  const emojiCollector = await pagination(templateEmbed, message, threads);

  const filter = m => {
    return m.author.id === message.author.id;
  };
  /**
   * Create Message collector with filter
   * @description
   * Will only be active for 1 minute (60000 ms)
   *
   * Will only collect first message user sends
   * @see filter
   **/
  const messageCollector = message.channel.createMessageCollector(filter, {
    max: 1,
    time: 60000,
    errors: ['time'],
  });

  const collectMessage = async messageIn => {
    let choice = /^(\d+)\s*$/.exec(messageIn.content);
    if (choice) {
      const index = parseInt(choice[0]) - 1;
      choice = index >= 0 && index < threads.length;
    }
    if (!choice) {
      if (emojiCollector !== null) {
        emojiCollector.stop(['The user has not chosen a new threadID']);
      }
      return;
    }

    messageIn.delete().catch(() => null);
    // Get user's choice
    const index = parseInt(messageIn.content) - 1;
    // get the ThreadID that the user chose
    threadID = threads[index].threadID;
    // get new query
    const threadQuery2 = await THREAD_QUERY({
      threadID: threadID,
      guildID: message.guild.id,
      channelID: message.channel.id,
    });
    if (emojiCollector !== null) {
      emojiCollector.stop(['The user has chosen a new threadID']);
    }

    if (createMode) addMessageToThread(message, threadQuery2.responseData[0]);
    else {
      const topic = threads[index].topic;
      templateEmbed
        .setTitle('Thread')
        .setDescription('')
        .addField('ID', decorateId(threads[index].threadID), true)
        .addField('Topic', topic === null ? 'none' : topic, true);
      pagination(templateEmbed, message, threadQuery2.responseData);
    }
  };
  // collect only one message.
  messageCollector.once('collect', collectMessage);
}

/**
 * Sends a message displaying an array of threads with pages.
 *
 * @param {Discord.RichEmbed} templateEmbed Template containing Title,
 * Description, and color that the pages will follow
 * @param {Discord.Message} message The invoking message.
 * @param {Thread} threads An array containing all the threads to display.
 * @param {Number?} itemsPerPage The number of items to display on each page.
 *
 * @return {Promise<Discord.ReactionCollector>}
 */
async function pagination(templateEmbed, message, threads, itemsPerPage = 5) {
  /**
   * @description Information about the pages of the book.
   * @type {Page}
   */
  const page = {
    upperBound: itemsPerPage,
    lowerBound: 0,
    currentPage: 0,
    maxPage: Math.ceil(threads.length / itemsPerPage) - 1,
    itemsPerPage: itemsPerPage,
  };

  /**
   * @description An array of embeds for each page.
   * @type {Discord.RichEmbed[]}
   */
  let threadListEmbeds = new Array(page.maxPage + 1);

  /*
   * if the given array is length one, grab the messages
   * from the thread instead
   */
  if (threads.length === 1) {
    // new maxPage is made from the amount of threadMessages
    page.maxPage =
      Math.ceil(threads[0].threadMessages.length / itemsPerPage) - 1;
    if (page.maxPage === -1) {
      templateEmbed.setDescription('This thread has no messages');
    }
    threadListEmbeds = new Array(page.maxPage + 1);
    threadListEmbeds[0] = await createMessageEmbed(
      threads[0].threadMessages,
      templateEmbed,
      page,
      message.channel,
      threads[0]
    );
  } else {
    threadListEmbeds[0] = await createThreadEmbed(
      threads,
      templateEmbed,
      page,
      message.channel
    );
  }
  const currentMsg = await message.channel.send(
    threadListEmbeds[page.currentPage]
  );

  // do not add listeners for single page
  if (page.maxPage <= 0) {
    return null;
  }

  const filter = (reaction, user) => {
    return (
      ['⬅️', '➡️'].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };

  const reactionCollector = currentMsg.createReactionCollector(filter, {
    time: 300000,
  });

  const handlePageTurn = async reaction => {
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

    page.lowerBound = page.currentPage * itemsPerPage;
    page.upperBound = (page.currentPage + 1) * itemsPerPage;
    if (threadListEmbeds[page.currentPage] === undefined) {
      if (threads.length === 1) {
        threadListEmbeds[page.currentPage] = await createMessageEmbed(
          threads[0].threadMessages,
          templateEmbed,
          page,
          message.channel,
          threads[0]
        );
      } else {
        threadListEmbeds[page.currentPage] = await createThreadEmbed(
          threads,
          templateEmbed,
          page,
          message.channel
        );
      }
    }
    currentMsg.edit(threadListEmbeds[page.currentPage]).catch(() => null);
    reaction.remove(reaction.users.last().id).catch(() => null);
  };

  reactionCollector.on('collect', handlePageTurn);
  await currentMsg.react('⬅️');
  await currentMsg.react('➡️');
  reactionCollector.on('end', () => {
    currentMsg.delete(120000).catch(() => null);
  });
  return reactionCollector;
}

/**
 * Creates a page that lists out threads.
 *
 * @param {Thread[]} threads An array containing the IDs of the messages to
 * display
 * @param {Discord.RichEmbed} templateEmbed template containing Title,
 * Description, and color that the pages will follow
 * @param {Page} page Information on the page of the embed.
 * @param {Discord.TextChannel} channel Channel to fetch messages from.
 *
 * @return {Promise<Discord.RichEmbed>} The embed to display.
 */
async function createThreadEmbed(threads, templateEmbed, page, channel) {
  const outputEmbed = new Discord.RichEmbed()
    .setTitle(templateEmbed.title)
    .setColor(templateEmbed.color)
    .setDescription(templateEmbed.description);
  for (const [index, thread] of threads
    .slice(page.lowerBound, page.upperBound)
    .entries()) {
    let j = thread.threadMessages.length;
    let lastMessage = null;
    while (lastMessage === null && j-- > 0) {
      const threadMessage = thread.threadMessages[j];
      lastMessage = await channel
        .fetchMessage(threadMessage.messageID)
        .catch(error => {
          if (error.message === 'Unknown Message') {
            DELETE_THREADMESSAGE({
              threadID: thread.threadID,
              guildID: thread.guildID,
              messageID: threadMessage.messageID,
            });
          }
          return null;
        });
    }
    if (lastMessage === null) {
      DELETE_THREAD({ threadID: thread.threadID, guildID: thread.guildID });
    } else {
      const author = lastMessage.author.username;
      const currentIndex = page.currentPage * page.itemsPerPage + index + 1;
      outputEmbed.addField(
        `${currentIndex}. ${thread.topic} (id: ${decorateId(thread.threadID)})`,
        `${author} on ${lastMessage.createdAt.toLocaleString()}\n${
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
 *
 * @param {String[]} messageIDs An array containing the IDs of the messages to
 * display
 * @param {Discord.RichEmbed} templateEmbed template containing Title,
 * Description, and color that the pages will follow
 * @param {Page} page Information on the page of the embed.
 * @param {Discord.TextChannel} channel Channel to fetch messages from.
 * @param {Thread} thread Thread being displayed.
 *
 * @return {Promise<Discord.RichEmbed>} The embed to display.
 */
async function createMessageEmbed(
  messageIDs,
  templateEmbed,
  page,
  channel,
  thread
) {
  const outputEmbed = new Discord.RichEmbed()
    .setTitle(templateEmbed.title)
    .setColor(templateEmbed.color)
    .setDescription(templateEmbed.description);
  for (const field of templateEmbed.fields)
    outputEmbed.addField(field.name, field.value, field.inline);
  for (const message of messageIDs.slice(page.lowerBound, page.upperBound)) {
    // Get the message and trim the command off
    await channel
      .fetchMessage(message.messageID)
      .then(async content => {
        const text = /^\[[\d\s-]{4,20}\]\s*(.+)/.exec(content.content);
        let trimmedMessage = content.content;
        if (text && text.length === 2) {
          trimmedMessage = text[1];
        }
        outputEmbed.addField(
          `${content.author.username} on ${content.createdAt.toLocaleString()}`,
          `${trimmedMessage}`
        );
      })
      .catch(async error => {
        if (error.message === 'Unknown Message') {
          DELETE_THREADMESSAGE({
            threadID: thread.threadID,
            guildID: thread.guildID,
            messageID: message.messageID,
          });
        }
      });
  }
  if (page.maxPage > 0)
    outputEmbed.setFooter(
      `Page ${page.currentPage + 1} of ${page.maxPage + 1}`
    );
  return outputEmbed;
}

module.exports = {
  createNewThread,
  addMessageToThread,
  pagination,
  multipleThreadResults,
};
