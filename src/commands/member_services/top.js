const Command = require('../Command');
const { POINTS_QUERY } = require('../../APIFunctions/points');
const Discord = require('discord.js');

module.exports = new Command({
  name: 'top',
  description: 'Displays the points leaderboard.',
  category: 'Member services',
  aliases: [],
  permissions: 'member',
  execute: async (message) => {
    pointsArray = await POINTS_QUERY({ guildID: message.guild.id });
    data = pointsArray.responseData;
    let length = data.length;
    if (length > 10) {
      const topEmbedCapped = new Discord.RichEmbed()
        .setColor('#52ba32')
        .setTitle('Points Leaderboard')
        .setTimestamp();
      for (let i = 0; i < 10; i++) {
        topEmbedCapped.addField(`<@${data[i].userID}>`, data[i].totalPoints);
      }
      message.channel.send(topEmbedCapped);
    }
    else {
      const topEmbedNoCap = new Discord.RichEmbed()
        .setColor('#52ba32')
        .setTitle('Points Leaderboard')
        .setTimestamp();
      for (let i = 0; i < length; i++) {
        topEmbedNoCap.addField(`<@${data[i].userID}>`, data[i].totalPoints);
      }
      message.channel.send(topEmbedNoCap);
    }
  }
});
