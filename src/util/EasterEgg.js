const Discord = require('discord.js');
const { EASTER_BASKET_ADD_EGG } = require('../APIFunctions/easter');
const { ONE_MINUTE } = require('./constants');
class EasterEgg {
  constructor(egg, channel, period) {
    this.period = period;
    this.channel = channel;
    this.egg = egg;
    this.timeout = null;
  }

  async start() {
    if (this.timeout) return; // already running

    // within 20% of this.period
    const randomDelay = this.period + Math.random() * 0.2 * this.period;

    const eggEmbed = new Discord.RichEmbed()
      .setTitle('Egg!Egg!')
      .setDescription('Hey look an egg!')
      .setThumbnail(this.egg.imageUrl);

    const sentMessage = await this.channel.send(eggEmbed);
    await sentMessage.react('🐰');

    const filter = (reaction, user) => {
      return ['🐰'].includes(reaction.emoji.name) && !user.bot;
    };
    const collector = await sentMessage.createReactionCollector(filter, {
      max: 1,
      time: ONE_MINUTE,
      errors: ['time'],
    });

    const collectReaction = async reaction => {
      const user = reaction.users.last();
      const guildID = reaction.message.guild.id;
      const userID = user.id;
      const response = EASTER_BASKET_ADD_EGG({
        guildID,
        userID,
        eggID: this.egg.eggID,
      });
      if (response.error) {
        this.channel.send('Internal error taking egg');
      } else {
        this.channel.send(`\`${user.username}\` has taken the egg!`);
      }
    };
    collector.once('collect', collectReaction);
    this.timeout = setTimeout(this.start.bind(this), randomDelay * ONE_MINUTE);
  }

  stop() {
    if (!this.timeout) return; // not running

    clearTimeout(this.timeout);
    this.timeout = null;
  }
}

module.exports = {
  EasterEgg,
};
