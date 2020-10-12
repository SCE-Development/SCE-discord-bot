const { Message } = require('discord.js');
const Command = require('../Command');

// var author, vcID, vc, oriname, changemsg;

/*
The problem to solve:
 - need cooldown for each voice channel
 - no cooldown when edit didn't execute
   - make command to remove cooldown
*/

const command = new Command({
  name: 'clearcooldown',
  description: 'Clear cooldown for command or a user',
  category: '',
  aliases: ['ccd'],
  permissions: 'member',
  example: 's!clearcooldown command {command name}, s!clearcooldown member {username}',
  cooldown: -1,
  execute: async (message, args) => {
    console.log("Cmd Start");
    if (args.length < 2) {
      message.channel.send('Your command is invalid. Make sure the command is in the right style.\n Example: s!clearcooldown command {command name}');
      return "error";
    }
    str = args.join(' ');
    if (!message.guild.available) {
      message.channel.send('The server (guild) is unavailable');
      return "error";
    }
    if (!message.member.voiceChannelID) {
      message.channel.send('You are not in a voice chat!');
      return "error";
    }

    console.log('end of cmd');
    return "end async";
  },
});

module.exports = {handleChangeVoiceChannel, command};