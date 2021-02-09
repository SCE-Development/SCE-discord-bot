const Command = require('../Command');
module.exports = new Command({
  name: 'reaper reap',
  description: 'Reap time - if there is no ongoing game, display a message saying so',
  aliases: [],
  example: 's!reaper reap',
  permissions: 'general',
  category: 'games',
execute: async (message, args) => {
    this.executeCommand(message, args);
  }
});
