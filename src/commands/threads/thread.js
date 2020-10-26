
const Command = require('../Command');

module.exports = new Command({
  name: 'thread',
  description: 'Create a new thread with a message',
  category: 'custom threads',
  aliases: [],
  permissions: 'general',
  execute: (message, args) => {
    console.log('Executed Command: <thread>, args=' + args);
  }
});
