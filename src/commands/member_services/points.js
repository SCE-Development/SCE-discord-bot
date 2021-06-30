const Command = require('../Command');
const { POINT_QUERY } = require('../../APIFunctions/points');
const Discord = require('discord.js');

module.exports = new Command({
  name: 'points',
  description: 'Check how many points you have earned.',
  category: 'Member services',
  aliases: ['pts'],
  example: 's!pts [@user]',
  permissions: 'member',
  execute: async (message) => {
    const author = message.member;
    // Query and display author points
    if (!message.mentions.members.first()) {
      const authorQuery = await POINT_QUERY({
        guildID: message.guild.id,
        userID: author.id
      });
      const point = authorQuery.responseData[0];
      if (!point) {
        message.channel.send('User has no points.');
        return;
      }
      else {
        const pointsEmbedNoMention = new Discord.MessageEmbed()
          .setColor('#03dffc')
          .setTitle('Point Breakdown')
          .setThumbnail(author.user.avatarURL())
          .addField('Total Points', point.totalPoints)
          .addField('Gained This Week', point.weekPoints)
          .addField('Gained This Month', point.monthPoints)
          .addField('Gained This Year', point.yearPoints)
          .setTimestamp();
        message.channel.send(pointsEmbedNoMention);
      }
      return;
    }
    // If a user is mentioned, query and display user's points
    const user = message.mentions.members.first();
    const userQuery = await POINT_QUERY({
      guildID: message.guild.id,
      userID: user.id
    });
    const point = userQuery.responseData[0];
    if (!point) {
      message.channel.send('User has no points.');
      return;
    }
    else {
      const pointsEmbedMention = new Discord.MessageEmbed()
        .setColor('#03dffc')
        .setTitle('Point Breakdown')
        .setThumbnail(user.user.avatarURL())
        .addField('Total Points', point.totalPoints)
        .addField('Gained This Week', point.weekPoints)
        .addField('Gained This Month', point.monthPoints)
        .addField('Gained This Year', point.yearPoints)
        .setTimestamp();
      message.channel.send(pointsEmbedMention);
    }
  }
});
