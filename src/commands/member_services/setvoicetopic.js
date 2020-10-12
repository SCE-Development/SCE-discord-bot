const Command = require('../Command');

const command = new Command({
  name: 'setvoicetopic',
  description: 'Rename Voice Channel',
  category: '',
  aliases: ['svt'],
  permissions: 'member',
  example: 's!setvoicetopic',
  execute: async (message, args) => {
    // Check if a user gave topic for args
    if (!args.length) {
      await message.channel.send('You need to give the name of the channel!').
      then((msg) => {msg.delete(5000);});
      return 'error';
    }
    const str = args.join(' ');
    // Check if guild is still available
    if (!message.guild.available) {
      await message.channel.send('The server (guild) is unavailable').
      then((msg) => {msg.delete(5000);});
      return 'error';
    }
    // Check if a user is in voicechannel
    if (!message.member.voiceChannelID) {
      await message.channel.send('You are not in a voice chat!').
      then((msg) => {msg.delete(5000);});
      return 'error';
    }

    const author = message.member;
    // Check if a user has permission to change channel name
    if (author.permissions.has('MANAGE_CHANNELS') || 
    author.permissions.has('ADMINISTRATOR')) {
      const vcID = message.member.voiceChannelID;
      const vc = author.guild.channels.get(vcID);
      const oriname = vc.name;
      // Function that edits the name
      const fin = new Promise(async function(resolve, reject){
        vc.edit({name: str+' ::('+oriname+')'}).then(() => {resolve();});
        setTimeout(function(){reject('timeout')},3000);
      }).then((res) => {return res;});

      try {
        await fin;
        await message.channel.send('Successfully changed Name!').
        then((msg) => {msg.delete(5000);});
      } catch (error) {
        await message.channel.send('You are on cooldown!').
        then((msg) => {msg.delete(5000);});
      } finally {
        message.delete(5000);
      }
    }
    return 'end async';
  },
});

// function that rename the channel back when the channel is empty
function handleChangeVoiceChannel(oldMember, newMember) {
  const ovcID = oldMember.voiceChannelID;
  if (ovcID) {
    const ovc = oldMember.guild.channels.get(ovcID);
    if (ovc.members.size === 0) {
      const sname = ovc.name.split('::(');
      if (sname.length >= 1) {
        const oriname = sname[sname.length-1];
        ovc.edit({name: oriname.substring(0, oriname.length - 1)}).catch(console.error);
      }
    }
  }
}

module.exports = {handleChangeVoiceChannel, command};
