const Command = require('../Command');

module.exports = new Command({
  name: 'top',
  description: 'Displays the points leaderboard.',
  category: 'Member services',
  aliases: [],
  permissions: 'member',
  execute: (message) => {
    // Use a switch-case Regex argument in this way:
    // If typing <w | week>, display top10 in the week
    // <m | month>, top10 in the month
    // <y | year>, top10 in the year
    // Otherwise, top10 of all time
    // At the bottom, display user's rank
    message.channel.send('Top');
  }
});
