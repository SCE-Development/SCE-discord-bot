const Command = require('../Command');

const snowboardEmoji = '🏂';
const clockEmoji = '🕑';

module.exports = new Command({
  name: 'tacos',
  description: 'Check if the bot is up',
  aliases: [],
  example: 's!ping',
  permissions: 'general',
  category: 'information',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const pingResponse = await message.channel.send(
      `Calculating latency... ${snowboardEmoji}`);
    const messageLatency =
      pingResponse.createdTimestamp - message.createdTimestamp;
    pingResponse.edit('Hi Im Phu');
  },
});
