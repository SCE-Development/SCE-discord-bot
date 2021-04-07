const Command = require('../Command');
const { POINTS_QUERY } = require('../../APIFunctions/points');
const Discord = require('discord.js');

function checkPoints(a, b) {
  return b.totalPoints - a.totalPoints;
}

module.exports = new Command({
  name: 'top',
  description: 'Displays the points leaderboard.',
  category: 'Member services',
  aliases: [],
  permissions: 'member',
  execute: async (message) => {
    pointsArray = await POINTS_QUERY({ guildID: message.guild.id });
    data = pointsArray.responseData;
    data.sort(checkPoints);
    let length = data.length;
    if (length > 10) {
      const topEmbedCapped = new Discord.RichEmbed()
        .setColor('#52ba32')
        .setTitle('Points Leaderboard')
        .setTimestamp();
      for (let i = 0; i < 10; i++) {
        topEmbedCapped.addField('Number' + i, `<@${data[i].userID}> `
        + data[i].totalPoints);
      }
      message.channel.send(topEmbedCapped);
    }
    else {
      const topEmbedNoCap = new Discord.RichEmbed()
        .setColor('#52ba32')
        .setTitle('Points Leaderboard')
        .setTimestamp();
      for (let i = 0; i < length; i++) {
        topEmbedNoCap.addField('Number ' + (i + 1), `<@${data[i].userID}> `
        + data[i].totalPoints);
      }
      message.channel.send(topEmbedNoCap);
    }
  }
});
