const Command = require('../Command');
module.exports = new Command({
  name: 'reaper leaderboard',
  description: 'View the leaderboard',
  aliases: [],
  example: 's!reaper leaderboard',
  permissions: 'general',
  category: 'games',
execute: async (message, args) => {
    this.executeCommand(message, args);
  }
});
