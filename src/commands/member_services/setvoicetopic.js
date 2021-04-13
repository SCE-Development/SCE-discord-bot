const Command = require('../Command');

module.exports = new Command({
  name: 'setvoicetopic',
  description: 'Rename Voice Channel, but can be only done 2 per 10 min',
  aliases: ['svt'],
  example: 's!setvoicetopic',
  permissions: 'member',
  category: 'member services',
  execute: async (message, args) => {
    // Check if a user gave topic for args
    if (!args.length) {
      message.channel.send('You need to give the name of the channel!').
        then((msg) => msg.delete({ timeout: 5000}).catch(() => {}));
      return ;
    }
    const str = args.join(' ');
    // Check if guild is still available
    if (!message.guild.available) {
      message.channel.send('The server (guild) is unavailable').
        then((msg) => msg.delete({ timeout: 5000}).catch(() => {}));
      return ;
    }
    // Check if a user is in voicechannel
    if (!message.member.voice.channel) {
      message.channel.send('You are not in a voice chat!').
        then((msg) => msg.delete({ timeout: 5000}).catch(() => {}));
      return ;
    }

    // Check if a user has permission to change channel name
    const vc = message.member.voice.channel;
    let oriname = vc.name;
    // Check if channel has been renamed or not
    const re = /(?<=: : \().+(?=\))/;
    if (re.test(oriname)) {
      oriname = oriname.match(re)[0];
    }
    try {
      await vc.edit({name: str+'  : : ('+oriname+')'});
      message.channel.send('Successfully changed Name!')
        .then((msg) => msg.delete({ timeout: 5000}).catch(() => {}));
    } catch (error) {
      message.channel.send('You are on cooldown! Try again in 10 minutes.')
        .then((msg) => msg.delete({ timeout: 5000}).catch(() => {}));
    } finally {
      message.delete({ timeout: 5000}).catch(() => {});
    }
  },
});
