const Discord = require('discord.js');
const Command = require('../Command');
const {
  EASTER_EGG_QUERY,
  EASTER_BASKET_ADD_EGG,
} = require('../../APIFunctions/easter');

module.exports = new Command({
  name: 'claim',
  description: 'Claim eggs in the egg hunt with a code',
  aliases: [],
  examples: 's!claim <code>',
  permissions: 'general',
  category: 'easter',
  disabled: false,
  execute: async (message, args) => {
    const eggResponse = await EASTER_EGG_QUERY({
      guildID: message.guild.id,
      code: args[0],
    });
    if (eggResponse.error) {
      message.channel
        .send(
          new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Easter Egg Event!')
            .setDescription(args[0] + ' is not an Easter Egg!')
        )
        .then(msg => {
          message.delete().catch(() => null);
          msg.delete(300000).catch(() => null);
        });
      return;
    }

    const response = await EASTER_BASKET_ADD_EGG({
      guildID: message.guild.id,
      userID: message.member.id,
      eggID: eggResponse.responseData[0].eggID,
    });

    if (response.error) {
      message.channel
        .send(
          new Discord.RichEmbed()
            .setColor('#ccffff')
            .setTitle('Easter Egg Event!')
            .setDescription('Error claiming egg! Maybe try again?')
        )
        .then(msg => {
          message.delete().catch(() => null);
          msg.delete(300000).catch(() => null);
        });
      return;
    }

    const claimEmbed = new Discord.RichEmbed()
      .setColor('#ccffff')
      .setTitle('You have claimed ' + args[0] + '!');
    if (eggResponse.responseData[0].description)
      claimEmbed.setDescription(eggResponse.responseData[0].description);
    if (eggResponse.responseData[0].imageUrl)
      claimEmbed.setImage(eggResponse.responseData[0].imageUrl);

    message.channel.send(claimEmbed).then(msg => {
      message.delete().catch(() => null);
      msg.delete(300000).catch(() => null);
    });
  },
});
