const handlersPath = '.';
const utilPath = '../util';

const { CommandHandler } = require(handlersPath + '/CommandHandler');
const { NonPrefixHandler } = require(handlersPath + '/NonPrefixHandler');
const { createNonPrefixRegex } = require(utilPath + '/NonPrefixRegexCreator');
const { POINTS_QUERY_ONE, ADD_POINTS } = require('../APIFunctions/points.js');

/**
 * Class which handles interpreting an input message and invoking the correct
 * command handler for the SCE discord bot
 */
class MessageHandler {
  /**
   * Create a MessageHandler.
   * @param {string} prefix The value used to trigger the bot, e.g. "s!".
   * @member {CommandHandler} commandHandler The handler for prefixed commands.
   * @member {NonPrefixHandler} nonPrefixHandler The handler
   * for non-prefix commands.
   */
  constructor(prefix) {
    this.prefix = prefix;
    this.commandHandler = new CommandHandler();
    this.nonPrefixHandler = new NonPrefixHandler();
  }

  /**
   * Initialize handlers and create nonPrefixRegex
   */
  initialize() {
    this.nonPrefixRegex = createNonPrefixRegex();
    this.commandHandler.initialize();
    this.nonPrefixHandler.initialize();
  }

  /**
   * Function to handle when a user or bot sends a message in discord.
   * @param {string} message An event triggered by a user's input.
   * Ignores message if the author is a bot
   */
  handleMessage(message) {
    if (message.author.bot) {
      return;
    }
    POINTS_QUERY_ONE(message);
    ADD_POINTS(message);
    if (message.content.startsWith(this.prefix)) {
      this.commandHandler.handleCommand(this.prefix, message);
    } else if (this.nonPrefixRegex.test(message.content)) {
      this.nonPrefixHandler.handleCommand(message);
    }
  }
}

module.exports = { MessageHandler };
