const Command = require('../Command');
const { POINTS_QUERY } = require('../../APIFunctions/points');

module.exports = new Command({
  name: 'points',
  description: 'Check how many points you have earned.',
  category: 'Member services',
  aliases: ['pts'],
  permissions: 'member',
  execute: (message) => {
    const author = message.member;
    POINTS_QUERY(message)
      .then((points) => {
        message.channel.send(
          author + '\'s Points: ' + points.responseData.totalPoints
        );
      });
  }
});
