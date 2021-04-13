const Command = require('../Command');
const Discord = require('discord.js');

module.exports = new Command ({
  name: 'privacypolicy',
  description: 'Displays privacy policy',
  aliases: [],
  example: 's!privacypolicy',
  permission: 'general',
  category: 'information',
  execute: async (message) => {
    const privacyEmbed = new Discord.MessageEmbed()
      .setColor('#ccffff')
      .setTitle('Privacy Policy')
      .setURL(
        'https://github.com/'
        + 'SCE-Development/SCE-discord-bot/wiki/Privacy-Policy'
      );
    message.channel.send(privacyEmbed)
      .then((msg) => {
        message.delete().catch(() => null);
        msg.delete({ timeout: 300000 }).catch(() => null);
      });
  }
});
