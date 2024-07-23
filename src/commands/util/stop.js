const { prefix } = require('../../../config.json');

const Command = require('../Command');

const audioManager = require('../../util/audioManager.js');


module.exports = new Command({
  name: 'stop',
  description: 'Stop, clear queues and disconnect the bot',
  aliases: ['stop'],
  example: `${prefix}stop`,
  permissions: 'member',
  category: 'music',
  disabled: false,
  execute: async (message) => {
    let queue = audioManager.getQueue();
    console.log('Before queue: ' + queue);
    audioManager.stop();
    queue = audioManager.getQueue();
    console.log('After queue: ' + queue);
    return message.reply("Bot stopped!")
  },
});
