const Command = require('../Command');
const { POINT_QUERY } = require('../../APIFunctions/points');
const Discord = require('discord.js');

// Sorts points in descending order
function comparePoints(a, b) {
  return b.totalPoints - a.totalPoints;
}

module.exports = new Command({
  name: 'top',
  description: 'Displays the points leaderboard.',
  category: 'Member services',
  aliases: [],
  permissions: 'member',
  execute: async (message) => {
    const pointsArray = await POINT_QUERY({ guildID: message.guild.id });
    const data = pointsArray.responseData;
    data.sort(comparePoints);
    let length = data.length;
    if (length === 0) {
      message.channel.send('No one has points. Get some by talking!');
      return;
    }
    // If more than 10 users with points, display top 10
    else if (length > 10) {
      const topEmbedCapped = new Discord.MessageEmbed()
        .setColor('#52ba32')
        .setTitle('Points Leaderboard')
        .setTimestamp();
      for (let i = 0; i < 10; i++) {
        topEmbedCapped.addField(
          `Number ${i + 1}`,
          `<@${data[i].userID}> ${data[i].totalPoints}`
        );
      }
      message.channel.send(topEmbedCapped);
    }
    else {
      const topEmbedNoCap = new Discord.MessageEmbed()
        .setColor('#52ba32')
        .setTitle('Points Leaderboard')
        .setTimestamp();
      for (let i = 0; i < length; i++) {
        topEmbedNoCap.addField(
          `Number ${i + 1}`,
          `<@${data[i].userID}> ${data[i].totalPoints}`
        );
      }
      message.channel.send(topEmbedNoCap);
    }
  }
});
