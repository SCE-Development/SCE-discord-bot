const Command = require('../Command');
const {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  CreateEgg,
} = require('../../util/eggHunt');

module.exports = new Command({
  name: 'egghunt',
  description: 'Can you find the eggs.',
  aliases: ['egg'],
  example: 's!egghunt -------',
  permissions: 'general',
  category: 'easter',
  disabled: false,
  execute: (message, args) => {
    switch (args[0]) {
      case 'admin':
        switch (args[1]) {
          case 'start':
            if (!args[2]) {
              message.channel.send('type in a channel name');
              return;
            }
            startEgghunt(args[2], message.guild);
            break;
          case 'stop':
            stopEgghunt(message.guild, args[2]);
            break;
          case 'add':
            CreateEgg(message.channel, message.author.id);
            break;
          default:
            console.log('Type valid');
            break;
        }
        break; // args[0] === 'admin'

      // args[0]
      case 'leaderboard':
      case 'eggs':
      case 'basket':
        displayEggs(
          message.author.id,
          message.guild.id,
          message.channel,
          args[1]
        );
        break; // args[0] === 'leaderboard' || 'eggs || 'basket'

      // args[0]
      default:
        // todo: display help
        break; // args[0] default
    }
  },
});
