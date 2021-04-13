const Command = require('../Command');
const {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  createEgg,
} = require('../../util/eggHunt');
const { isOfficer } = require('../../util/Permission');
const { sendMessageAndDelete } = require('../../util/messages');
const { SHORT_WAIT } = require('../../util/constants');

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
        if (!isOfficer(message.member)) {
          sendMessageAndDelete(message.channel, 'Not high enough rank sir.');
          return;
        }
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
            sendMessageAndDelete(
              message.channel,
              'Valid options are: `start`, `stop`, `add`',
              SHORT_WAIT
            );
            break;
        }
        break; // args[0] === 'admin'

      // args[0]
      case 'leaderboard':
      case 'eggs':
      case 'basket':
        displayEggs(message, args[0]);
        break;

      default:
        // todo: display help
        break;
    }
  },
});
