const Command = require('./commands/Command');
const { CooldownManager } = require('./util/CooldownManager');
const { INVALID_TIME } = require('./util/constants');
const { parseCommandParameters } = require('./util/CommandParser');

const Discord = require('discord.js');
const requireDir = require('require-dir');

/**
 * Class which handles interpreting a user's input and invoking the correct
 * command for the SCE discord bot.
 */
class CommandHandler {
  /**
   * Create a CommandHandler.
   * @param {string} commandPath The path to a directory containing all of the
   * command files.
   * @param {string} prefix The value used to trigger the bot, e.g. "s!".
   * @member {string} commandMap A map containing a command name e.g. "ping"
   * mapped to the proper class that handles it.
   * @member {CooldownManager} cooldownManager An instance of the
   * CooldownManager class to avoid spam from users.
   */
  constructor(commandPath, prefix) {
    this.commandPath = commandPath;
    this.prefix = prefix;
    this.commandMap = new Discord.Collection();
    this.cooldownManager = new CooldownManager();
  }

  /**
   * Iterate through the supplied command directory to populate the commandMap.
   */
  initialize() {
    const commandFiles = requireDir(this.commandPath, { recurse: true });
    for (const directory in commandFiles) {
      for (const file in commandFiles[directory]) {
        const command = require(`${this.commandPath}/${directory}/${file}`);
        // console.log(command);
        if (command instanceof Command) {
          this.commandMap.set(command.name, command);
          command.aliases.map(alias => this.commandMap.set(alias, command));
        } else if (command.command instanceof Command) {
          const cmd = command.command;
          this.commandMap.set(cmd.name, cmd);
          cmd.aliases.map(alias => this.commandMap.set(alias, cmd));
        }
      }
    }
  }

  /**
   * Helper method to avoid the bot calling itself in a loop.
   * @param {string} message An event triggered by a user's input.
   * @returns {bool} If the event is a valid invocation of the bot or not.
   */
  botIsCallingItself(message) {
    return (!message.content.startsWith(this.prefix) || message.author.bot);
  }

  /**
   * Function to handle when a user sends a message in discord.
   * @param {string} message An event triggered by a user's input.
   */
  handleMessage(message) {
    if (this.botIsCallingItself(message)) {
      return;
    }
    let args = message.content.slice(this.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    args = parseCommandParameters(args.join(' '));

    // if (commandName === "ccc" || commandName === 'clearcooldown')
    // {
    //   this.cooldownManager.
    // } else 
    if (!this.commandMap.has(commandName)) {
      console.log('no such command');
      return;
    } else {
      const cooldownStatus = this.cooldownManager.needsToCoolDown(
        message.author.id, this.commandMap.get(commandName));
      if (cooldownStatus !== INVALID_TIME) {
        message.channel.send(`please wait ${cooldownStatus.toFixed(1)} `
          + `more second(s) before reusing the \`${commandName}\` command.`);
        return;
      }
      try {
        // Add a commands field to message.client to 
        // reference all available commands
        message.client.commands = this.commandMap;
        this.executeCommand(commandName, message, args);
      } catch (Exception) { }
    }
  }

  /**
   * Execute a bot command.
   * @param {string} commandName The name of the command to be invoked.
   * @param {string} message Data related to the command invocation
   * @param {Discord.Collection} message.client.commands A map containing
   * all of the available bot commands.
   * @param {Object} args Any arguments sent from the user.
   */
  executeCommand(commandName, message, args) {
    const command = this.commandMap.get(commandName);
    try {
      command.execute(message, args);
    } catch (Exception) { }
  }
}

module.exports = { CommandHandler };
