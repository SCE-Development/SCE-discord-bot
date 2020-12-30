const Discord  = require('discord.js');

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
  * @param {Number} ITEM_PER_PAGE 
  * @return {Discord.ReactionCollector}
  */
async function pagination(templateEmbed, message, 
  threads, messageMode, ITEM_PER_PAGE = 5){
  /**
   * @description
   * all necessary values needed to traverse through
   * the "book" of data
   * @type {Page}
   */
  let page = {
    upperBound: ITEM_PER_PAGE,
    lowerBound: 0,
    currentPage: 0,
    maxPage: Math.ceil(threads.length / ITEM_PER_PAGE) - 1,
    ITEM_PER_PAGE: ITEM_PER_PAGE
  };

  /**
   * @description
   * The "book" of data, each array index holds one page.
   * This variable is a collection of pages - a book.
   * @type {Discord.RichEmbed[]}
   */
  let threadListEmbed = new Array(page.maxPage);
  
  /**
   * if the given array is length one, grab the messages 
   * from the thread instead
   */ 
  if(threads.length === 1)
  {
    // new maxpage is made from the amount of threadMessages
    page.maxPage = Math.ceil(
      threads[0].threadMessages.length / ITEM_PER_PAGE) - 1;
    threadListEmbed = new Array(page.maxPage);
    threadListEmbed = await createMessageEmbed(templateEmbed, 
      threads[0].threadMessages, threadListEmbed, page, message);
  }
  else
  {
    threadListEmbed = await createThreadEmbed(templateEmbed, threads, 
      threadListEmbed, page, messageMode);
  }
  console.log("HERE");
  let currentMsg = await message.channel
    .send(threadListEmbed[page.currentPage]);
  console.log("DONE");
    // if more than 1 maxPage (not 0) then add transition emojis
  if(page.maxPage)
  {
    await currentMsg.react('⬅️');
    await currentMsg.react('➡️'); 
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
  const emojiCollector = currentMsg
    .createReactionCollector(filter, { time: 300000 });
  
  /**
   * Action that happens when the actionlistener is called.
   * @param {Discord.Reaction} reaction reaction collected by the collector
   * @see messageCollector
   */
  const checkEmoji = async reaction => {      
    // Handles what the current page is 
    switch (reaction.emoji.name) {
      case '➡️':   
        if(page.currentPage < page.maxPage)
          page.currentPage++;
        else 
          page.currentPage = 0;
        break;
      case '⬅️':   
        if(page.currentPage > 0)
          page.currentPage--;
        else
          page.currentPage = page.maxPage;
        break;
    }
    // Some math to identify lower and upper bound
    page.lowerBound = page.currentPage * ITEM_PER_PAGE;
    page.upperBound = ITEM_PER_PAGE + (page.currentPage * ITEM_PER_PAGE);
    if(threads.length === 1)
    {
      threadListEmbed = await createMessageEmbed(templateEmbed, 
        threads[0].threadMessages, threadListEmbed, page, message);
    }
    else
    {
      threadListEmbed = await createThreadEmbed(templateEmbed, threads,
        threadListEmbed, page, messageMode);      
    }
    currentMsg
      .edit(threadListEmbed[page.currentPage])
      .catch();
    await reaction.remove(reaction.users.last().id);
  };
  // turn on the collector
  emojiCollector.on('collect', checkEmoji);
  emojiCollector.on('end', () => { 
    currentMsg.delete();
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
  * @param {Discord.RichEmbed[]} threadListEmbed 
  * The "book" of data, each array index holds one page.
  * This variable is a collection of pages - a book.
  * @param {Page} page
  * @param {Boolean} messageMode
  * @return {Discord.RichEmbed[]}
  */
async function createThreadEmbed(templateEmbed, threads,
  threadListEmbed, page, messageMode){
  if(threadListEmbed[page.currentPage] === undefined)
  {
    threadListEmbed[page.currentPage] = new Discord.RichEmbed()
      .setColor(templateEmbed.color)
      .setTitle(templateEmbed.title);
    if(messageMode)
    {
      threadListEmbed[page.currentPage]
        .setDescription(templateEmbed.description);
    }
    for (const [index, thread] of threads
      .slice(page.lowerBound, page.upperBound).entries())
      {
        let currentIndex = page.currentPage * page.ITEM_PER_PAGE + index + 1;
        threadListEmbed[page.currentPage]
          .addField(`${currentIndex}. Thread ID: ${thread.threadID}`,
            `topic: ${thread.topic}`);
      }
    if(page.maxPage)
      threadListEmbed[page.currentPage]
        .setFooter(`Page: ${page.currentPage+1}/${page.maxPage+1}`);
  }
  return threadListEmbed;
}
  
 /**
  * Creates a page that lists out thread messages inside a thread.
  * @param {Discord.RichEmbed} templateEmbed 
  * template containing Title, Description, and color that
  * the pages will follow
  * @param {import('../../APIFunctions/thread').Thread} threads 
  * An array containing ALL items that will be displayed in the "book"
  * @param {Discord.RichEmbed[]} threadListEmbed 
  * The "book" of data, each array index holds one page.
  * This variable is a collection of pages - a book.
  * @param {Page} page
  * @param {Boolean} messageMode
  * @return {Discord.RichEmbed[]}
  */
async function createMessageEmbed(templateEmbed, threads,
  threadListEmbed, page, message){
  if(threadListEmbed[page.currentPage] === undefined)
  {
    threadListEmbed[page.currentPage] = new Discord.RichEmbed()
      .setColor(templateEmbed.color)
      .setTitle(templateEmbed.title);
    let messageManager = message.channel;
    for (const [index, message] of threads
      .slice(page.lowerBound, page.upperBound).entries()) {
      let currentIndex = page.currentPage * page.ITEM_PER_PAGE + index + 1;
      let content = await messageManager.fetchMessage(message.messageID);
      let trimmedMessage = /^\|\s*(\d{4,13})\s*\|\s*(.+)/
        .exec(content.content)[2];
      threadListEmbed[page.currentPage]
        .addField(`Message ${currentIndex}:`,
          trimmedMessage);
    }
    if(page.maxPage)
      threadListEmbed[page.currentPage]
        .setFooter(`Page: ${page.currentPage+1}/${page.maxPage+1}`);
  }
  return threadListEmbed;
}
  
module.exports = 
  {
    pagination
  };
