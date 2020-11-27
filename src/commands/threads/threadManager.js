const Command = require('../Command');

module.exports = new Command({
  name: 'threadmanager',
  description: 'Thread Manager. Used for managing custom threads.',
  aliases: ['tm'],
  example: 's!tm',
  permissions: 'admin',
  category: 'custom threads',
  execute: (message, args) => {
    console.log('Executed Command: <thread manager>, args=' + args);
  }
});
