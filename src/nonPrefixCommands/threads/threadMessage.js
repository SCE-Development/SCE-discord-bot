
const Discord = require('discord.js');
const Command = require('../Command');
const { THREAD_ID_QUERY } 
  = require('../../APIFunctions/thread');
const { createNewThread, addMessageToThread, multipleThreadResults } 
  = require('../nonPrefixFunctions/threadHandling');  
const { pagination } = require('../nonPrefixFunctions/pagination'); 
/**
 * @typedef   {Object}    Data
 *
 * @property  {String}    threadID        The ID of the thread.
 * @property  {String}    messageID       The message ID of the message.
 * @property  {String}    [topic]         The topic of the thread.
 * @property  {String}    creatorID       The user ID of the creator.
 * @property  {String}    channelID       The ID of the channel.
 * @property  {String}    guildID         The ID of the guild.
 * @property  {String}    [threadMsg]     The message the user tpyed
 */

module.exports = new Command({
  name: 'no-prefix threadmessage',
  regex: new RegExp(/^\|\s*(\d{4,13})\s*\|/),
  description: 'Create or add to a thread with an ID',
  example: '|<thread ID>| [message]',
  category: 'custom threads',
  permissions: 'general',
  execute: async (message) => {
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
     * any APIfunction
     * @type {Data}
     */
    const data = 
    {
      threadID : /^\|\s*(\d{4,13})\s*\|/.exec(message)[1],
      messageID : message.id, 
      topic: createMode ? 
        /^\|\s*(\d{4,13})\s*\|\s*(.{0,10})/.exec(message)[2] : '',
      creatorID: message.author.id,
      channelID: message.channel.id,
      guildID : message.guild.id,
      threadMsg : createMode ? 
        /^\|\s*(\d{4,13})\s*\|\s*(.+)/.exec(message)[2] : '',
    };
    
    //  MESSAGE HANDLING
    let threadQuery = await THREAD_ID_QUERY(data);
    if(threadQuery.error)
    {
      message.channel
        .send('Error')
        .then((msg) => msg.delete(10000));
      return;
    }
    
    let templateEmbed = new Discord.RichEmbed()
      .setColor('#301934')
      .setTitle(`All threads that start with ID: ${data.threadID}`)
      .setDescription('Choose one! Example: type "1"');
    // Special cases when there are 0, 1, or more than 1 thread responses
    switch (threadQuery.responseData.length) {
      case 0:   
        if(createMode)
          await createNewThread(data, message); 
        else
        {
          console.log('no threads');
        }
        break;
      case 1:   
        if(createMode)
          await addMessageToThread(data, message, threadQuery);
        else
          await pagination(templateEmbed, message, threadQuery.responseData, true, 10);
        break;
      default:  
        await multipleThreadResults(data, message, threadQuery, createMode);
    }
  }
});
