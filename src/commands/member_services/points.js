const Command = require('../Command');

module.exports = new Command({
  name: 'points',
  description: 'Check how many points you have earned.',
  category: 'Member services',
  aliases: ['pts', 'rank'],
  permissions: 'member',
  execute: (message, args) => {
    // Display how many points you have and your rank
    // Display 4 ranks: per week/month/year/all-time
  }
})
