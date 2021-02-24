const Command = require('../Command');
const { POINTS_QUERY } = require('../../APIFunctions/points');
const Discord = require('discord.js');

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
          const pointsEmbedNoMention = new Discord.RichEmbed()
            .setColor('#03dffc')
            .setTitle('Point Breakdown')
            .setThumbnail(author.user.avatarURL)
            .addField('Total Points', points.responseData.totalPoints)
            .addField('Gained This Week', points.responseData.weekPoints)
            .addField('Gained This Month', points.responseData.monthPoints)
            .addField('Gained This Year', points.responseData.yearPoints)
            .setTimestamp()
          if (points.responseData == null) {
            message.channel.send('User has no points.');
          }
          else {
            message.channel.send(pointsEmbedNoMention);
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
        if (points.responseData == null) {
          message.channel.send('User has no points.');
        }
        else {
          const pointsEmbedMention = new Discord.RichEmbed()
            .setColor('#03dffc')
            .setTitle('Point Breakdown')
            .setThumbnail(user.user.avatarURL)
            .addField('User', user)
            .addField('Total Points', points.responseData.totalPoints)
            .addField('Gained This Week', points.responseData.weekPoints)
            .addField('Gained This Month', points.responseData.monthPoints)
            .addField('Gained This Year', points.responseData.yearPoints)
            .setTimestamp()
          message.channel.send(pointsEmbedMention);
        }
      });
    return;
  }
});
