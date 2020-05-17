const Command = require('../Command');

const snowboardEmoji = '🏂';
const clockEmoji = '🕑';

module.exports = new Command({
  name: 'ping',
  description: 'check if the bot is up',
  category: 'information',
  aliases: [],
  permissions: 'general',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const pingResponse = await message.channel.send(
      `Calculating latency... ${snowboardEmoji}`);
    const messageLatency =
      pingResponse.createdTimestamp - message.createdTimestamp;
    pingResponse.edit(`Pong! Latency is ${messageLatency} ms ${clockEmoji}.`);
  },
});
