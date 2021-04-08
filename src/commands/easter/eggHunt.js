const Command = require('../Command');
const {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  createEgg,
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
            startEgghunt(message);
            break;

          case 'stop':
            stopEgghunt(message);
            break;

          case 'add':
            createEgg(message);
            break;

          default:
            message.channel
              .send('Valid options are: `start`, `stop`, `add`')
              .then(msg => msg.delete(20000).catch(() => {}));
            break;
        }
        break; // args[0] === 'admin'

      // args[0]
      case 'leaderboard':
      case 'eggs':
      case 'basket':
        displayEggs(message, args[1]);
        break;

      default:
        // todo: display help
        break;
    }
  },
});
