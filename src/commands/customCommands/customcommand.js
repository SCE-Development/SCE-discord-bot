const Command = require('../Command');
const {
  QUERY_ALL,
  QUERY_GUILD,
  QUERY_SINGLE,
  CREATE_COMMAND,
  DELETE_COMMAND,
  UPDATE_COMMAND,
} = require('../../APIFunctions/customCommand');


module.exports = new Command({
  name: 'customcommand',
  description: 'Users can make a custom command that sends a message to the channel',
  aliases: ['cc'],
  example: 's!customcommand <command> or s!cc <command> (<command> is case sensitive)',
  permissions: 'general',
  category: 'custom command',
 
  execute: async (message, args) => {
    console.log(args);
    if(args)
    {
      const commandQuery = await QUERY_SINGLE({
        commandName: args[0]
      });
      console.log(commandQuery);
      if(commandQuery.responseData)
      {
        message.channel.send(commandQuery.responseData.message);
        await UPDATE_COMMAND({
          commandName: args[0],
          timesUsed: commandQuery.timesUsed++
        });
      }
      else
      {
        await CREATE_COMMAND({
          commandName: args[0],
          guildID: message.guild.id,
          creatorID: message.author.id,
          message: 'uhhh im just testing this lol'
        });
        message.channel.send("ayye created");
      }
    }
    else
    {
      const allCommands = await QUERY_ALL();
      message.channel.send(allCommands.length);
    }
    return;
  },
});