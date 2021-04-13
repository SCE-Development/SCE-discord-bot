const { XSHORT_WAIT, MED_WAIT } = require('./constants');

/**
 * Sends and deletes a message.
 *
 * @param {Discord.TextChannel} channel Channel to send the message in.
 * @param {string} content Message to send.
 * @param {Number?} keepAlive Time in milliseconds before deleting the message.
 * Does not delete if negative. Defaults to 10 seconds.
 *
 * @returns Promise<Discord.Message> The deleted message.
 */
const sendMessageAndDelete = async (
  channel,
  content,
  keepAlive = XSHORT_WAIT
) => {
  const message = await channel.send(content);
  if (keepAlive < 0) return message;

  return deleteMessage(message, keepAlive);
};

/**
 * Deletes a message after some time. Catches errors if user deletes the
 * message first.
 *
 * @param {Discord.Message} message Message to delete.
 * @param {Number?} delay Time to wait in milliseconds before deleting.
 * Defaults to 0. Deletes immediately if 0 or negative.
 *
 * @returns {Promise<Discord.Message>} The deleted message, or null if the
 * message could not be deleted (user deleted).
 */
const deleteMessage = (message, delay = 0) => {
  try {
    if (delay > 0) return message.delete(delay);
    return message.delete();
  } catch (e) {
    return null;
  }
};

/**
 * Asks the user to thumbs up or thumbs down a message.
 *
 * @param {Discord.TextChannel} channel Channel to send the confirmation
 * message in.
 * @param {Discord.User} user User who can confirm the action.
 * @param {Discord.RichEmbed} embed Embed to display to the user.
 *
 * @returns {Promise<boolean>} User's response.
 */
const askConfirmation = async (channel, user, embed) => {
  const confirmMessage = await channel.send(embed);
  confirmMessage
    .react('👍')
    .then(() => confirmMessage.react('👎'))
    .catch(() => null);

  const filter = (reaction, reactionUser) => {
    return (
      ['👍', '👎'].includes(reaction.emoji.name) && reactionUser.id === user.id
    );
  };

  const collected = await confirmMessage.awaitReactions(filter, {
    max: 1,
    time: MED_WAIT,
    errors: ['time'],
  });
  const reaction = collected.first();

  if (reaction.emoji.name === '👍') {
    deleteMessage(confirmMessage);
    return true;
  }

  confirmMessage.edit('Canceled');
  confirmMessage.clearReactions();
  confirmMessage.suppressEmbeds();
  deleteMessage(confirmMessage, XSHORT_WAIT);

  return false;
};

/**
 * Gets the next message from a user.
 *
 * @param {Discord.TextChannel} channel Channel to listen in.
 * @param {Discord.User} user User to listen for.
 * @param {Number?} waitTime Time to wait for in milliseconds. Defaults to
 * 1 minute.
 *
 * @returns {Promise<Discord.Message>} User's next message. Rejected if no
 * response.
 */
const getInput = async (channel, user, { waitTime = MED_WAIT } = {}) => {
  const filter = message => message.member.id === user.id;
  const messageCollector = channel.createMessageCollector(filter, {
    maxMatches: 1,
    time: waitTime,
    errors: ['time'],
  });

  const response = new Promise((resolve, reject) => {
    messageCollector.on('collect', message => resolve(message));
    messageCollector.on('end', () => reject('time'));
  });

  return response;
};

module.exports = {
  sendMessageAndDelete,
  deleteMessage,
  askConfirmation,
  getInput,
};
