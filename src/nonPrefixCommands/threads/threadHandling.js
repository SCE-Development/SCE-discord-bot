
const Discord  = require('discord.js');
const { THREAD_ID_QUERY, ADD_THREADMESSAGE, CREATE_THREAD } 
  = require('../../APIFunctions/thread');
const { pagination } = require('./pagination');

/**
 * @param {import('../threads/threadMessage').Data} data 
 * Trimmed down to only necessary values
 * @param {Discord.Message} message 
 */
async function createNewThread(data, message, threadMsg){
  if(threadMsg.length > 130)
  {
    let warningEmbed = new Discord.RichEmbed()
      .setTitle('Warning')
      .setDescription(`The topic is too long for a new thread.
        If the intention was to add a message to a thread starting\
        with \`${data.threadID}\`, there is no such thread`);
    message.channel.send(warningEmbed);
    return;
  }
  const confirmAction = async (topic) =>
  {
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
      .setTitle('New Thread')
      .setDescription(`
        Use \`|thread id|\` to view the full thread or\
        \`|thread id|\` <message> to add to
        the thread.
        Type at least 4 digits of the thread id.
        (If thread ID is a new ID, the <message>\
        will be the topic of the new thread)`)
      .addField('ID', `${createThread.responseData.threadID}`, true)
      .addField('Topic', `${createThread.responseData.topic}`, true)
      .setTimestamp(message.createdAt.toLocaleString());
    await message.channel.send(threadCreateEmbed);
  }
}

/**
 * @param {import('../threads/threadMessage').Data} data 
 * Object containing all necessary data to use any APIfunction
 * @param {Discord.Message} message 
 * @param {import('../../APIFunctions/thread').ThreadOnePayload} threadQuery
 */
async function addMessageToThread(data, message, threadQuery, threadMsg){
  //  We're adding in a message to the ID that was searched
  data.threadID = threadQuery.responseData[0].threadID;
  data.topic = threadQuery.responseData[0].topic;
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
    .setTitle('New Message')
    .setDescription(
      `Use \`|thread id|\` to view the full thread or\
      \`|thread id|\` <message> to add to the thread.
      Type at least 4 digits of the thread id.
      (If thread ID is a new ID, the <message>\
      will be the topic of the new thread)`)
    .addField('ID', data.threadID, true)
    .addField('Topic', data.topic === null ? 'none' : data.topic, true)
    .addField('Added Message', threadMsg)
    .setTimestamp(message.createdAt.toLocaleString());
  await message.channel
    .send(addedEmbed)
    .then((msg) => msg.delete(300000));
}
  
/**
   * @param {import('../threads/threadMessage').Data} data
   * Object containing all necessary data to use any APIfunction
   * @param {Discord.Message} message 
   * the original message that started this command
   * @param {import('../../APIFunctions/thread').ThreadOnePayload} threadQuery
   * @param {Boolean} createMode chooses how to deal with the data
   **/
async function multipleThreadResults(data, message, threadQuery, 
  createMode, threadMsg){
  let templateEmbed = new Discord.RichEmbed()
    .setColor('#301934')
    .setTitle(`All threads that start with ID: ${data.threadID}`)
    .setDescription('Choose one! Example: type "1"');
  
  let emojiCollector 
     = await pagination(templateEmbed, message,
       threadQuery.responseData, true);
    
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
  let filter = (m) => {
    let goodChoice = /^(\d+)\s*$/.exec(m.content);
    if(goodChoice)
      goodChoice = parseInt(goodChoice[0]) - 1 
          < threadQuery.responseData.length;
    return ( 
      goodChoice &&    
        m.author.id === message.author.id
    );
  };
  /** 
   * Create Message collector with filter
   * @description
   * Will only be active for 5 minutes (300000 ms)
   * 
   * Will only collect message with valid messages 
   * @see filter
   **/ 
  const messageCollector = message.channel
    .createMessageCollector(filter, { time: 300000 });

  /**
   * Action that happens when the actionlistener is called.
   * @param {Discord.Message} messageIn message collected by the collector
   * @see messageCollector
   */
  const collectMessage = async (messageIn) =>
  {
    messageIn.delete();
    // Get user's choice
    let index = Number(messageIn.content) - 1;
    // get the ThreadID that the user chose
    data.threadID = threadQuery
      .responseData[index].threadID;
    // get new query
    let threadQuery2 = await THREAD_ID_QUERY(data); 
    emojiCollector.stop(['The user has chosen a new threadID']);
    /**
     * createMode = true 
     * means user is looking for new messages so 
     * it makes a page displaying the messages of the thread
     * false
     * User is trying to add a message to a thread
     */
    if(createMode)
      await addMessageToThread({
        threadID : data.threadID,
        messageID: data.messageID
      }, message, threadQuery2, threadMsg);
    else
    {
      let topic = threadQuery.responseData[index].topic;
      templateEmbed.setTitle('Thread')
        .setDescription('')
        .addField('ID', threadQuery.responseData[index].threadID, true)
        .addField('Topic', topic === null ? 'none' : topic, true);
      await pagination(templateEmbed, message, 
        threadQuery2.responseData, true);
    }  
  };
  // collect only one message.
  messageCollector.once('collect', collectMessage);
}
  
module.exports =
  {
    createNewThread,
    multipleThreadResults,
    addMessageToThread
  };
