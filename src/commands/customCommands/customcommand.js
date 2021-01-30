const Command = require('../Command');


module.exports = new Command({
  name: 'customcommand',
  description: 'Users can make a custom command that sends a message to the channel',
  aliases: ['cc'],
  example: 's!customcommand <command> or s!cc <command>',
  permissions: 'general',
  category: 'custom command',
 
  execute: async (message, args) => {
  },
});