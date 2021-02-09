const Command = require('../Command');
module.exports = new Command({
  name: 'reaper timer',
  description: 'See current time that you would get if you reaped',
  aliases: [],
  example: 's!reaper timer',
  permissions: 'general',
  category: 'games',
execute: async (message, args) => {
    this.executeCommand(message, args);
  }
});
