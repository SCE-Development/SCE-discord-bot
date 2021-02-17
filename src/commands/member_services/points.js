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
    // Query author points
    if (!message.mentions.members.first()) {
      POINTS_QUERY({
        guildID: message.guild.id,
        userID: author.id
      })
        .then((points) => {
          if (points.responseData == null) {
            message.channel.send('User has no points.');
          }
          else {
            message.channel.send(
              author.toString() + '\'s Points: '
              + points.responseData.totalPoints
            );
          }
        });
      return;
    }
    // If a user is mentioned, query their points
    const user = message.mentions.members.first();
    POINTS_QUERY({
      guildID: message.guild.id,
      userID: user.id
    })
      .then((points) => {
        console.log(points);
        if (points.responseData == null) {
          message.channel.send('User has no points.');
        }
        else {
          message.channel.send(
            user + '\'s Points: ' + points.responseData.totalPoints
          );
        }
      });
    return;
  }
});
