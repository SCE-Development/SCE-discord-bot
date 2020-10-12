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
  name: 'setvoicetopic',
  description: 'Rename Voice Channel',
  category: '',
  aliases: ['svt'],
  permissions: 'member',
  example: 's!setvoicetopic',
  cooldown: 600,
  execute: async (message, args) => {
    console.log("Cmd Start");
    var str = args.join('');
    if (str === '') {
      message.channel.send('You need to give the name of the channel!');
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

    const author = message.member;
    if (author.permissions.has('MANAGE_CHANNELS') || author.permissions.has('ADMINISTRATOR')) {
      try {
        // console.log("wait vcID");
        const vcID = message.member.voiceChannelID;
        // console.log("wait vc");
        const vc = author.guild.channels.get(vcID);
        const oriname = vc.name;
        // console.log(vcID, oriname, vc);
        const fin = vc.edit({name: str+" ("+oriname+")"});
        console.log("awaiting for edit");
        console.log(await Promise.all([vcID, vc, fin]));
      } catch (error) {
        console.log(error);
      }
    }
    console.log('end of cmd');
    return "end async";
  },
});

function handleChangeVoiceChannel(oldMember, newMember) {
  console.log("VC changed");
  const ovcID = oldMember.voiceChannelID;
  if (ovcID) {
    const ovc = oldMember.guild.channels.get(ovcID);
    console.log(ovc.members.size);
    if (ovc.members.size === 0) {
      const sname = ovc.name.split("(");
      console.log("sname:",sname.length,sname);
      if (sname.length >= 1) {
        const oriname = sname[sname.length-1];
        ovc.edit({name: oriname.substring(0, oriname.length - 1)}).catch(console.error);
      }
    }
  }
}

module.exports = {handleChangeVoiceChannel, command};