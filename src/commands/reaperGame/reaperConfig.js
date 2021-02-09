const Command = require('../Command');
module.exports = new Command({
  name: 'reaper config',
  description: 'Configures the game (how often you can reap, target score) and starts it',
  aliases: [],
  example: 's!reaper config',
  permissions: 'admin',
  category: 'games',
execute: async (message, args) => {
    this.executeCommand(message, args);
  }
});
