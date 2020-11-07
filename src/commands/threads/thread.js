
const Command = require('../Command');

module.exports = new Command({
  name: 'thread',
  description: 'Create a new thread with a message',
  aliases: [],
  example: 's!thread',
  permissions: 'general',
  category: 'custom threads',
  disabled: true,
  execute: (message, args) => {
    console.log('Executed Command: <thread>, args=' + args);
  }
});
