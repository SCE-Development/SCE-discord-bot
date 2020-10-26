const Command = require('../Command');

module.exports = new Command({
  name: 'top',
  description: 'Displays the points leaderboard.',
  category: 'Member services',
  aliases: [],
  permissions: 'member',
  execute: (message, args) => {
    // Use a switch-case Regex argument in this way:
<<<<<<< HEAD
    // If typing <w | week>, display top10 in the week
    // <m | month>, top10 in the month
    // <y | year>, top10 in the year
=======
    // If typing <w | weekly>, display top10 in the week
    // <m | monthly>, top10 in the month
    // <y | yearly>, top10 in the year
>>>>>>> d94d812... Sets the framework for displaying ranks
    // Otherwise, top10 of all time
    // At the bottom, display user's rank
  }
})