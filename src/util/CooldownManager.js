const Discord = require('discord.js');
const { INVALID_TIME } = require('./constants');

/**
 * Class which keeps track of a user's invocation of a command so they can't
 * spam the bot.
 */
class CooldownManager {
  /**
   * Create a CooldownManager.
   * @member {Discord.Collection} cooldownMap Maps command names to a
   * secondary Discord.Collection which maps user ID's to the timestamps a
   * command was last invoked.
   */
  constructor() {
    this.cooldownMap = new Discord.Collection();
  }

  /**
   * Determine if a user needs to wait before invoking a command.
   * @param {string} authorId The identification number of the author,
   * generated by discord.
   * @param {Command} command Instance of the Command class which contains
   * various info about the command invoked.
   * @returns {Number} The amount of time needed to wait for cooldown to
   * complete, or INVALID_TIME if there is no need to wait.
   */
  needsToCoolDown(authorId, command) {
    let cooldownTime = INVALID_TIME;
    const now = Date.now();
    if (!this.cooldownMap.has(command.name)) {
      this.cooldownMap.set(command.name, new Discord.Collection());
    }
    const timestamps = this.cooldownMap.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(authorId)) {
      const expirationTime = timestamps.get(authorId)
        + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        cooldownTime = timeLeft;
      }
      setTimeout(() => timestamps.delete(authorId), cooldownAmount);
    } else {
      timestamps.set(authorId, now);
      this.cooldownMap.set(command.name, timestamps);
    }
    return cooldownTime;
  }
}

module.exports = { CooldownManager };
