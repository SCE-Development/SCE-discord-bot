const Discord = require('discord.js');
const { EASTER_BASKET_ADD_EGG } = require('../APIFunctions/easter');

const eggPics = [
  'https://cdn.discordapp.com/attachments/308817739999608832/828026817964539954/eggac.png',
  'https://cdn.discordapp.com/attachments/308817739999608832/828025305456312411/eggdiluc.png',
  'https://cdn.discordapp.com/attachments/308817739999608832/828028933088870440/eggme.png',
];

class Egg {
  constructor(delayTime, channel, guild, eggID) {
    this.delayRange = [delayTime * 0.68, delayTime * 1.4];
    this.channel = channel;
    this.guild = guild;
    this.timeout = undefined;
    this.eggID = eggID;
  }

  async start(delayTime) {
    if (this.channel === undefined) return;
    if (delayTime != undefined)
      this.delayRange = [delayTime * 0.4, delayTime * 1.4];
    let randomDelay = Math.floor(
      Math.random() * (this.delayRange[1] - this.delayRange[0]) +
        this.delayRange[0]
    );

    let choice = Math.floor(Math.random() * 3);
    const eggEmbed = new Discord.RichEmbed()
      .setTitle('Egg!Egg!')
      .setDescription('Hey look an egg!')
      .setThumbnail(this.eggPics[choice]);

    let sentMessage = await this.channel.send(eggEmbed);
    await sentMessage.react('🐰');

    const filter = (reaction, user) => {
      return ['🐰'].includes(reaction.emoji.name) && !user.bot;
    };
    let collector = await sentMessage.createReactionCollector(filter, {
      max: 1,
      time: randomDelay * 1.4,
      errors: ['time'],
    });

    const collectReaction = async reaction => {
      let user = reaction.users.last();
      let guildID = reaction.message.guild.id;
      let userID = user.id;
      const response = EASTER_BASKET_ADD_EGG({
        guildID,
        userID,
        eggID: this.eggID,
      });
      if (response.error) {
        this.channel.send('Internal error taking egg');
      } else {
        this.channel.send(`\`${user.username}\` has taken the egg!`);
      }
    };
    collector.once('collect', collectReaction);
    this.timeout = setTimeout(this.start.bind(this), randomDelay);
  }

  stop() {
    if (this.timeout === undefined) return;
    clearTimeout(this.timeout);
    this.timeout = undefined;
  }
}

module.exports = {
  Egg,
};
