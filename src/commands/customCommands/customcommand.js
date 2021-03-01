const Command = require('../Command');
const Discord = require('discord.js');
const {
  QUERY_ALL,
  QUERY_SINGLE,
  CREATE_COMMAND,
  DELETE_COMMAND,
  UPDATE_COMMAND,
} = require('../../APIFunctions/customCommand');
const { pagination } = require('../../util/dataDisplay');
const { isOfficer } = require('../../util/Permission');

module.exports = new Command({
  name: 'customcommand',
  description: `Users can make a custom command 
    that sends a message to the channel`,
  aliases: ['cc'],
  example: 's!customcommand [create | delete | <commandName>]',
  permissions: 'general',
  category: 'custom command',
 
  execute: async (message, args) => {
    switch (args[0]){
      case 'create':
        createCustomCommand(message.author.id, message.channel);
        break;
      case 'delete':
        deleteCustomCommand(message.author.id, message.channel
          , message.guild.id, message.member);
        break;
      default:{
        let commandName = args[0].toLowerCase();
        let commandQuery = await QUERY_SINGLE({commandName: commandName});
        if(args[0]){
          console.log(commandQuery);
          if(commandQuery.responseData){
            let timesUsed = commandQuery.responseData.timesUsed + 1;
            UPDATE_COMMAND({
              commandName: commandName,
              timesUsed: timesUsed
            });
            message.channel.send(commandQuery.responseData.message);
            return;
          }
        }
        commandQuery = await QUERY_ALL();
        let commandLength = commandQuery.responseData.length;
        if(commandLength){
          let fieldData = new Array(commandLength);
          let index = 0;
          for(const data of commandQuery.responseData)
          {
            let user = await message.guild.fetchMember(data.creatorID);
            let singleData = {
              title: data.commandName,
              field: `Used ${data.timesUsed} times
              Created by ${user.displayName}`
            };
            fieldData[index] = singleData;
            index++;
          }

          const templateEmbed = new Discord.RichEmbed()
            .setTitle('Commands')
            .setDescription('');
          pagination(templateEmbed, message.channel, 
            message.author.id, fieldData);
          return;
        }
        message.channel.send('There are no commands!');
      }
        return;
    }
  },
});

function createCustomCommand(authorID, channel){
  let instructionEmbed = new Discord.RichEmbed()
    .setTitle('Type in your desired command name encased in quotations')
    .addField('Followed by the message you want.', 
      `Example: "[CommandName]"I want this 
        message to display (no spaces in commandname)`);
  channel.send(instructionEmbed);

  const filter = m => {
    console.log(authorID, m.author.id);
    return m.author.id === authorID;
  };
  /**
   * Create Message collector with filter
   * @description
   * Will only be active for 1 minute (60000 ms)
   *
   * Will only collect first message user sends
   * @see filter
   **/
  const messageCollector = channel.createMessageCollector(filter, {
    max: 2,
    time: 60000,
    errors: ['time'],
  });

  const collectMessage = async newMessage => {
    if(!/"(\S+)"(.+)/.test(newMessage.content)) return;
    let messageSplitter = /"(\S+)"(.+)/.exec(newMessage.content);
    let commandName = messageSplitter[1].toLowerCase();
    let commandResponse = messageSplitter[2];
    let commandQuery = await QUERY_SINGLE({commandName: commandName});
    
    if(commandQuery.responseData === null){
      let createCommand = await CREATE_COMMAND({
        commandName: commandName,
        guildID: channel.guild.id,
        creatorID: authorID,
        message: commandResponse
      });
      /* Post create messages */
      if(createCommand.error){
        channel.
          send(`Your command cannot be created because of an error. 
            (DEBUG CODE: @CUSTOMCOMMAND/CREATE)`)
          .then(msg => msg.delete(30000).catch(() => null));
        return;
      }
      let createEmbed = new Discord.RichEmbed()
        .setTitle('Success!')
        .addField('CommandName', 
          `${commandName}`, true)
        .addField('Command Response',
          `${commandResponse}`, true);
      channel.send(createEmbed);
      /* END */
    }
  };
  messageCollector.on('collect', collectMessage);
}

function deleteCustomCommand(authorID, channel, guildID, author ){

  let instructionEmbed = new Discord.RichEmbed()
    .setTitle('Type in your desired command name')
    .setDescription(`The command will be deleted if it is created by you, and
  part of the same guild`);
  channel.send(instructionEmbed);

  const filter = m => {
    console.log(authorID, m.author.id);
    return m.author.id === authorID;
  };
  /**
   * Create Message collector with filter
   * @description
   * Will only be active for 1 minute (60000 ms)
   *
   * Will only collect first message user sends
   * @see filter
   **/
  const messageCollector = channel.createMessageCollector(filter, {
    max: 2,
    time: 60000,
    errors: ['time'],
  });
  const collectMessage = async newMessage => {
    let commandName = newMessage.content.toLowerCase();
    const commandQuery = await QUERY_SINGLE({commandName: commandName});
    if(!isOfficer(author))
    {
      if(commandQuery.responseData === null){
        channel.send('No such command')
          .then(msg => msg.delete(30000).catch(() => null));
        return;
      }
      if(guildID != commandQuery.responseData.guildID)
      {
        channel.send('Cannot delete other guild\'s command')
          .then(msg => msg.delete(30000).catch(() => null));
        return;
      }
      if(authorID != commandQuery.responseData.creatorID)
      {
        channel.send('Cannot delete other people\'s command')
          .then(msg => msg.delete(30000).catch(() => null));
        return;
      }
    }
    await DELETE_COMMAND({
      creatorID: authorID,
      commandName: commandName
    });
    channel.send('Deleted Command');
  };
  messageCollector.on('collect', collectMessage);
}
