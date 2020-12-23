
const Discord  = require('discord.js');
const Command = require('../Command');
const { FIND_THREAD, ADD_THREADMESSAGE, CREATE_THREAD } 
  = require('../../APIFunctions/thread');

module.exports = new Command({
  name: 'no-prefix threadmessage',
  regex: new RegExp(/^\|\s*(\d{4,13})\s*\|\s+/),
  description: 'Create or add to a thread with an ID',
  category: 'custom threads',
  permissions: 'general',
  execute: async (message) => {
    await message.delete();
    const data = 
    {
      threadID : /^\|\s*(\d{4,13})\s*\|\s+(.+)/.exec(message)[1],
      messageID : message.id, 
      topic: /^\|\s*(\d{4,13})\s*\|\s+(.{0,10})/.exec(message)[2],
      creatorID: message.author.id,
      guildID : message.guild.id,
      threadMsg : /^\|\s*(\d{4,13})\s*\|\s+(.+)/.exec(message)[2],
    };
    //  MESSAGE HANDLING
    let queryThread = await FIND_THREAD(data);
    if(queryThread.error)
    {
      message.channel
        .send('Error')
        .then((msg) => msg.delete(10000));
      return;
    }
    switch (queryThread.responseData.length) {
      case 0:   
        await createNewThread(data, message); 
        break;
      case 1:   
        await addMessageToThread(data, message, queryThread);
        break;
      default:  
        await multipleThreadResults(data, message, queryThread);
    }
  }
});
/** 
 * Below is all the supporting functions
 * @param {enumeration} data an enumeration containing all 
 * necessary data to do APIfunction calls, and make embeds
 * @param {Discord.Message} message the original message 
 * that started this command
 **/
async function createNewThread(data, message){
  //  confrim act
  const confirmAction = async (topic) =>
  {
    const confirmEmbed = new Discord.RichEmbed();
    confirmEmbed.setTitle('Create new thread?').addField('Topic: ', topic);
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
      .awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
      .then((collected) => {
        const reaction = collected.first();
        confirmMessage.delete();
        return reaction.emoji.name === '👍';
      })
      .catch(() => {
        confirmMessage.delete();
        message.channel
          .send('Not created')
          .then((msg) => msg.delete(10000));
        return false;
      });
  };

  const confirmed = await confirmAction(data.topic);  
  if(!confirmed)
  {
    await message.channel
      .send('Not created')
      .then((msg) => msg.delete(10000));
    return;
  }
  if(confirmed)
  {
    const autogenID = message.createdTimestamp
      .toString().split('').reverse().join(''); 
      //  flips the time stamp
    data.threadID = data.threadID + autogenID.substr(data.threadID.length);
    const createThread = await CREATE_THREAD(data);
    if(createThread.error)
    {
      message.channel
        .send('Error creating')
        .then((msg) => msg.delete(10000));
      return;
    }
    const threadCreateEmbed = new Discord.RichEmbed()
      .setColor('#301934')
      .setTitle(`Created Thread ${createThread.responseData.threadID}`)
      .addField('Topic', `${createThread.responseData.topic}`);
    return await message.channel.send(threadCreateEmbed);
  }
}
/**
 * @param {Enumeration} data an enumeration containing all 
 * necessary data to do APIfunction calls, and make embeds
 * @param {Discord.Message} message the original message 
 * that started this command
 * @param {araay} queryThread the response from FIND_THREAD(data). 
 * IMPORTANT: HAS TO BE THE RESPONSE FROM FIND_THREAD
 **/
async function addMessageToThread(data, message, queryThread){
  console.log(`Added message to ${data.threadID}`);
  //  We're adding in a message to the ID that was searched
  data.threadID = queryThread.responseData[0].threadID;
  const addMsg = await ADD_THREADMESSAGE(data);
  if(addMsg.error)
  {
    message.channel
      .send('Error adding')
      .then((msg) => msg.delete(10000));
    return;
  }
  const addedEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle(`Added message to Thread ${data.threadID}`)
    .addField('Message', `${data.threadMsg}`);
  return await
  message.channel
    .send(addedEmbed)
    .then((msg) => msg.delete(10000));
}

/**
 * @param {Enumeration} data an enumeration containing 
 * all necessary data to do APIfunction calls, and make embeds
 * @param {Discord.Message} message the original message 
 * that started this command
 * @param {araay} queryThread the response from FIND_THREAD(data). 
 * IMPORTANT: HAS TO BE RESPONSE FROM FIND_THREAD
 **/
async function multipleThreadResults(data, message, queryThread){
  /**
     * @var {Enumeration} page This var contains all necessary 
     * data to create a "book" of data
     * @var {array} threadListEmbed this array holds each page.
     * Each page is a RichEmbed
     **/
  let page = {
    upperBound: 9,
    lowerBound: 0,
    currentPage: 0,
    maxPage: Math.floor(queryThread.responseData.length / 10)
  };
  let threadListEmbed = [];
  threadListEmbed.push(new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle(`All threads that start with ID: ${data.threadID}`));
  queryThread.responseData
    .slice(page.lowerBound, page.upperBound).forEach(thread => 
      threadListEmbed[page.currentPage]
        .addField(`Thread ID: ${thread.threadID}`, `topic: ${thread.topic}`)
    );
  threadListEmbed[page.currentPage]
    .setFooter(`Page: ${page.currentPage+1}/${page.maxPage+1}`);
    
  // Tell user what they need to do 
  const addMoreDigitsEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle(`Add more digits to ID ${data.threadID}`);
  let currentMsg = await message.channel
    .send(threadListEmbed[page.currentPage]);
  let InstructionMsg = await message.channel
    .send(addMoreDigitsEmbed);
  
  await currentMsg.react('⬅️');
  await currentMsg.react('⏹️');
  await currentMsg.react('➡️');
    
  //  Initialize Reaction Collector
  let filter = (reaction, user) => {
    return (
      ['⬅️', '⏹️', '➡️'].includes(reaction.emoji.name) &&
        user.id === message.author.id
    );
  };
  const emojiCollector = currentMsg.createReactionCollector(filter);
  const checkEmoji = async reaction => {
    let change = true;
    console.log(reaction.emoji.name);
      
    /**
     *  Handles what the current page is and 
     *  what the range of threads we want is
     **/  
    switch (reaction.emoji.name) {
      case '➡️':   
        if(page.currentPage < page.maxPage)
        {
          page.currentPage++;
          page.lowerBound = page.lowerBound + 10;
          page.upperBound = page.upperBound + 10;
        }
        else change = false; 
        break;
      case '⬅️':   
        if(page.currentPage > 0)
        {
          page.currentPage--;
          page.lowerBound = page.lowerBound - 10;
          page.upperBound = page.upperBound - 10;
        }
        else change = false; 
        break;
      case '⏹️':  
        emojiCollector.stop(['The user has chosen a new threadID']);
        messageCollector.stop(['User chose an acceptable threadID']); 
        return;
    }
    //  making the new page if the page hasnt been already made
    if(threadListEmbed[page.currentPage] === undefined)
    {
      console.log('Created new ThreadListEmbed');
      threadListEmbed.push(new Discord.RichEmbed()
        .setColor('#301934')
        .setTitle(`All threads that start with ID: ${data.threadID}`));
      queryThread.responseData
        .slice(page.lowerBound, page.upperBound).forEach(thread => 
          threadListEmbed[page.currentPage]
            .addField(`Thread ID: ${thread.threadID}`, `topic: ${thread.topic}`)
        );
      threadListEmbed[page.currentPage]
        .setFooter(`Page: ${page.currentPage+1}/${page.maxPage+1}`);
    }
    //  edits in the new page if a the Emoji choice will not give an error
    if(change)
      currentMsg
        .edit(threadListEmbed[page.currentPage])
        .catch(() => console.log('ERROR MOVING'));
    await reaction.remove(reaction.users.last().id);
  };
    // turn on the collector
  emojiCollector.on('collect', checkEmoji);

  /** 
     * Create Message collector
     * @param {Discord.Message} m is message collected by discord
     * new filter for message collector 
     **/ 
  filter = (m) => {
    let regex = new RegExp('^'+data.threadID+'\\d+'); 
    let newID = m.content.match(regex);
    return (
      /** 
       * if regex matches (new id starts with old id) and 
       * authors are same then message is collected
       **/ 
      newID != null &&    
      m.author.id === message.author.id
    );
  };
  const messageCollector = message.channel.createMessageCollector(filter);
  const collectMessage = async (messageIn) =>
  {
    messageIn.delete();
    console.log(`Got new message ${messageIn.content}`);
    //  turn off all collectors
    emojiCollector.stop(['The user has chosen a new threadID']);
    messageCollector.stop(['User chose an acceptable threadID']); 
      
    data.threadID =  messageIn.content;
    //  choice depends on how many threads are returned
    let queryThread = await FIND_THREAD(data);
    switch (queryThread.responseData.length) {
      case 0:   
        await createNewThread(data, message); 
        break;
      case 1:   
        await addMessageToThread(data, message, queryThread);
        break;
      default:  
        await multipleThreadResults(data, message, queryThread);
    }
  };
  messageCollector.on('collect', collectMessage);
  //  when collector is turned off, previous messages
  messageCollector.on('end', async () => { 
    await currentMsg.delete();
    await InstructionMsg.delete();
  });
  return true;
}
