const nonPrefixCommandsPath = '../nonPrefixCommands';
const utilPath = '../util';

const Command = require(nonPrefixCommandsPath + '/Command');
const { CooldownManager } = require(utilPath + '/CooldownManager');
const { INVALID_TIME } = require(utilPath + '/constants');

const requireDir = require('require-dir');

/**
 * Class which handles invoking the correct non-prefix commands
 * for the SCE discord bot and checks the user's cooldown status
 * for the command.
 */
class NonPrefixHandler {

  /**
   * Create a NonPrefixHandler.
   * @member {string} commandArr An array containing all
   * the non-prefix command classes.
   * @member {CooldownManager} cooldownManager An instance of the
   * CooldownManager class to avoid spam from users.
   */
  constructor() {
    this.commandArr = [];
    this.cooldownManager = new CooldownManager();
  }

  /**
   * Iterate through the supplied command directory to populate the commandArr.
   */
  initialize() {
    const commandFiles = requireDir(nonPrefixCommandsPath, { recurse: true });
    for (const directory in commandFiles) {
      for (const file in commandFiles[directory]) {
        const command = require(
          `${nonPrefixCommandsPath}/${directory}/${file}`
        );
        if (command instanceof Command && !command.disabled) {
          this.commandArr.push(command);
        }
      }
    }
  }

  /**
   * Function to handle when a user sends a non-prefix command in discord.
   * @param {string} message An event triggered by a user's input.
   * @requires message author is not a bot
   * Informs user if the command is on cooldown.
   */
  handleCommand(message) {
    // find command with matching regex
    for (let index = 0; index < this.commandArr.length; index++) {
      const command = this.commandArr[index];
      if (command.regex.test(message.content)) {
        const cooldownStatus = this.cooldownManager.needsToCoolDown(
          message.author.id, command
        );
        if (cooldownStatus !== INVALID_TIME) {
          message.channel.send(`please wait ${cooldownStatus.toFixed(1)} `
            + `more second(s) before reusing the \`${command.name}\` command.`);
          return;
        }

        try {
          command.execute(message);
        } catch (Exception) { }

        break;
      }
    }
  }

}

module.exports = { NonPrefixHandler };
