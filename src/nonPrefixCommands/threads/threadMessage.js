
const { DiscordAPIError } = require('discord.js');
const Discord  = require('discord.js');
const Command = require('../Command');
const { FIND_THREAD, ADD_THREADMESSAGE, CREATE_THREAD } = require('../../APIFunctions/thread');


module.exports = new Command({
  name: 'no-prefix threadmessage',
  regex: new RegExp(/^\|\s*(\d{1,18})\s*\|\s+/),
  description: 'Create or add to a thread with an ID',
  category: 'custom threads',
  permissions: 'general',
  execute: (message) => {
    const threadId = /^\|\s*(\d{1,18})\s*\|\s+(.+)/.exec(message)[1];
    const threadMsg = /^\|\s*(\d{1,18})\s*\|\s+(.+)/.exec(message)[2];
    
    const threadResponse = new Discord.RichEmbed()      
    .setColor('#301934')
    .setTitle("Threads");
     
    let topic = /^\|\s*(\d{1,18})\s*\|\s+(.{0,10})/.exec(message)[2];

    const data = 
    {
      threadID : threadId,
      messageID : message.id,
      topic: topic,
      creatorID: message.author.id,
      guildID : message.guild.id
    }
          //confrim act
  const confirmAction = async (topic) =>
  {
    const confirmEmbed = new Discord.RichEmbed();
    confirmEmbed.setTitle("Create new thread?").addField('Topic: ', topic);
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

    const findMSG = async () => await FIND_THREAD(data);
    const createThread = async () => await CREATE_THREAD(data);
    const addMsg = async() => await ADD_THREADMESSAGE(data);
    findMSG().then((response) => {
      if(response.error)
      {
        message.channel
        .send('Error')
        .then((msg) => msg.delete(10000));
        return;
      }
      else if(response.responseData === null)
      {
        confirmAction(topic).then((confirmed) => {
          if(!confirmed)
          {
            message.channel
            .send('Not created')
            .then((msg) => msg.delete(10000));
            return;
          }
          if(confirmed)
          {
            createThread().then((response) => {
              if(response.error)
              {
                message.channel
                .send('Error creating')
                .then((msg) => msg.delete(10000));
                return;
              }
              message.channel
              .send('created')
              .then((msg) => msg.delete(10000));
              return;
            });
          }
        });
      }
      else
      {
        addMsg().then((response) => {
          if(response.error)
          {
            message.channel
            .send('Error adding')
            .then((msg) => msg.delete(10000));
            return;
          }
          message.channel
          .send('added')
          .then((msg) => msg.delete(10000));
          return;
        });
      }
    });
  }
});
