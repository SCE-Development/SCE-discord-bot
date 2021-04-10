const Discord = require('discord.js');
const { EasterEgg } = require('./easterEgg');
const {
  ADD_EASTER_EGG_CHANNEL,
  REMOVE_EASTER_EGG_CHANNEL,
} = require('../APIFunctions/guildConfig');

class EggHuntClient {
  constructor(args) {
    this.sceBot = args.sceBot;
    this.guildEggMap = new Discord.Collection();
  }

  async addEgg(eggID, channel, period = 30) {
    let channelEggMap = this.guildEggMap.get(channel.guild.id);
    if (!channelEggMap) {
      channelEggMap = new Discord.Collection();
      this.guildEggMap.set(channel.guild.id, channelEggMap);
    }

    let eggMap = channelEggMap.get(channel.id);
    if (!eggMap) {
      eggMap = new Discord.Collection();
      channelEggMap.set(channel.id, eggMap);
    }

    // check if egg is already in channel
    if (eggMap.has(eggID)) return 'dup';
    console.log({
      guildID: channel.guild.id,
      channelID: channel.id,
      eggID: eggID,
      period: period,
    });
    const response = await ADD_EASTER_EGG_CHANNEL({
      guildID: channel.guild.id,
      channelID: channel.id,
      eggID: eggID,
      period: period,
    });
    console.log(response);
    if (response.error) return 'error';

    const { egg } = response.responseData.easter.eggChannels.find(
      elem => elem.egg.eggID === eggID
    );

    const easterEgg = new EasterEgg(egg, channel, period);
    easterEgg.start();
    eggMap.set(egg.eggID, easterEgg);
    
    return 'ok';
  }

  async stopEgg(eggID, channel) {
    const channelEggMap = this.guildEggMap.get(channel.guild.id);
    if (!channelEggMap) return 'dne';
    const eggMap = this.channelEggMap.get(channel.id);
    if (!eggMap) return 'dne';
    const easterEgg = this.eggMap.get(eggID);
    if (!easterEgg) return 'dne';

    const response = await REMOVE_EASTER_EGG_CHANNEL({
      guildID: channel.guild.id,
      channelID: channel.id,
      eggID,
    });
    if (response.error) return 'error';

    easterEgg.stop();
    eggMap.delete(eggID);

    return 'ok';
  }
}

module.exports = { EggHuntClient };
