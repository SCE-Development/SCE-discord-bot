const commandsPath = '../commands';
const requireDir = require('require-dir');

const Command = require(commandsPath + '/Command');

const prefix = 's!';

const Discord = require('discord.js') 
let commandMap = new Discord.Collection();

function initialize(){
  const commandFiles = requireDir(commandsPath, { recurse: true });
  for (const directory in commandFiles) {
    for (const file in commandFiles[directory]) {
      const command = require(`${commandsPath}/${directory}/${file}`);
      if (command instanceof Command) {
        if (!command.disabled) {
          commandMap.set(command.name, command);
          command.aliases.map(alias => commandMap.set(alias, command));
        }
      }
    }
  }
}

initialize();

    function countSuccessCommands(message){
      createJSON(message,true);
    
    }

    function countUnsuccessCommands(message){
      createJSON(message,false);
    }


    function createJSON(message,successful){

      let date = new Date;
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      let userID = message.author.id;
      let channelID = message.channel.id;
      let msg = message.content;
      let args = message.content.substring(prefix.length).split(/ +/);
      let command_name = commandMap.get(msg.substring(prefix.length));
      let discord_data;
      date = new Date(
        new Date().getFullYear(),
        new Date().getMonth() ,
        new Date().getDate()
      )
        .toISOString()
        .split("T")[0];
      
      
      discord_data = {
        'Command_Name' : args.shift(),
        'Command_Args' : args,
        'Channel_ID' : channelID, 
        'Message' : msg,
        'Date': date,
        'Time': time,
        'UserID': userID,
        'Successful': successful
    }
    console.log(discord_data);
    
    return discord_data;
    }


    function countInvalidCommands(message){
      let date = new Date;
      let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      let userID = message.author.id;
      let channelID = message.channel.id;
      let msg = message.content;
      let args = message.content.substring(prefix.length).split(/ +/);
      let discord_data;
      args.shift();
      date = new Date(
        date.getFullYear(),
        date.getMonth() ,
        date.getDate()
      )
        .toISOString()
        .split("T")[0];
  
      discord_data = {
        'Command_Name' : null,
        'Command_Args' : args,
        'Channel_ID' : channelID, 
        'Message' : msg,
        'Date': date,
        'Time': time,
        'UserID': userID,
        'Successful': false
    }
    console.log(discord_data);
    }


/*

    discord_data = {
                'Command_Name' : command_name,
                'Command_Args' : args,
                'Channel_ID' : channelID,
                'Message' : msg,
                'Date': date,
                'Time': time,
                'UserID': userID,
                'Successful': false
            }
    */

    module.exports = {countUnsuccessCommands, countSuccessCommands, countInvalidCommands};
   