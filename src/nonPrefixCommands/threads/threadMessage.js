
const Discord = require('discord.js');
const Command = require('../Command');
const { prefix } = require('../../../config.json');
const { THREAD_ID_QUERY } 
  = require('../../APIFunctions/thread');
const { createNewThread, addMessageToThread, multipleThreadResults } 
  = require('./threadHandling');  
const { pagination } = require('./pagination'); 
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
        /^\|\s*(\d{4,13})\s*\|\s*(.{0,100})/.exec(message)[2] : null,
      creatorID: message.author.id,
      channelID: message.channel.id,
      guildID : message.guild.id,
      threadMsg : createMode ? 
        /^\|\s*(\d{4,13})\s*\|\s*(.+)/.exec(message)[2] : '',
    };
    
    //  MESSAGE HANDLING
    let threadQuery = await THREAD_ID_QUERY({
      threadID : data.threadID,
      channelID : data.channelID,
      guildID : data.guildID
    });
    if(threadQuery.error)
    {
      let errorEmbed = Discord.RichEmbed()
        .setTitle('Error!')
        .setDescription(`This ID, \`${data.threadID},is an invalid ID to search.
          Please report this bug to an officer.`);
      message.channel
        .send(errorEmbed)
        .then((msg) => msg.delete(100000));
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
          await createNewThread({
            threadID : data.threadID,
            messageID : data.messageID, 
            topic: data.topic,
            creatorID: data.creatorID,
            channelID: data.channelID,
            guildID : data.guildID,
          }, message, data.threadMsg); 
        else
        {
          let noResultEmbed = new Discord.RichEmbed()
            .setTitle('No results')
            .setDescription(
              `There may have been a typo, you can use \`${prefix}thread all\`\
            to check if a thread starts with \`${data.threadID}\` manually`);
          message.channel
            .send(noResultEmbed)
            .then((msg) => msg.delete(120000));
        }
        break;
      case 1:   
        if(createMode)
          await addMessageToThread({
            threadID : data.threadID,
            messageID : data.messageID
          }, message, threadQuery, data.threadMsg);
        else
        {
          let topic = threadQuery.responseData[0].topic;
          templateEmbed.setTitle('Thread')
            .setDescription('')
            .addField('ID', threadQuery.responseData[0].threadID, true)
            .addField('Topic', topic === null ? 'none' : topic, true);
          await pagination(templateEmbed, message, 
            threadQuery.responseData, true);
        }
        break;
      default:  
        await multipleThreadResults({
          threadID : data.threadID,
          messageID : data.messageID,
          channelID : data.channelID,
          guildID : data.guildID
        }, message, threadQuery, createMode, data.threadMsg);
    }
  }
});
