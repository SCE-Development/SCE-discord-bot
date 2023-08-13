const Command = require('../Command');
const { CommandCategory } = require('../../util/enums');


const snowboardEmoji = '🏂';
const clockEmoji = '🕑';

module.exports = new Command({
  name: 'ping',
  description: 'Check if the bot is up',
  aliases: [],
  example: 's!ping',
  permissions: 'general',
  category: CommandCategory.INFORMATION,
  // eslint-disable-next-line
  execute: async (message, args) => {
    const pingResponse = await message.channel.send(
      `Calculating latency... ${snowboardEmoji}`);
    const messageLatency =
      pingResponse.createdTimestamp - message.createdTimestamp;
    pingResponse.edit(`Pong! Latency is ${messageLatency} ms ${clockEmoji}.`);
  },
});
