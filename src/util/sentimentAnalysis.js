/**
 * Check the sentiment of a message and alert moderators if it is hate speech.
 * @param {Discord.message} message User message to check sentiment on.
 *
 * @returns {Promise<boolean>} Whether the message is probable hate speech.
 */
const checkSentiment = async message => {
  const { guild } = message;
  
  const channel = await guild.channel.cache.find(
    elem => elem.id === '753132015422799942'
  );
};

module.exports = { checkSentiment };
