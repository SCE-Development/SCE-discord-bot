const {prefix} = require('../../../config.json');
const Command = require('../Command');

module.exports = new Command({
  name: 'uptime',
  description: 'Check the bot\'s uptime',
  aliases: [],
  example: `${prefix}uptime`,
  permissions: 'general',
  category: 'information',
  execute: async (message) => {
    // send the botStartTime to the channel in the format of "up 2 days, 8 hours, 12 minutes since 2024-06-08T04:39:01.387Z"
    const today = new Date()
    const diffDate = today - message.botStartTime;
    const {days, hours, minutes} = converMSToISO(diffDate);
    const returnedMsg = `up ${days} ${days > 1 ? 'days' : 'day'}, ${hours} ${hours > 1 ? 'hours' : 'hour'}, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'} since ${message.botStartTime.toISOString()}`
    
    message.channel.send(`\`\`\`${returnedMsg}\`\`\``)
  }
})

const converMSToISO = (ms) => {
  const milisecondPerMinute = 60000;
  const milisecondPerHour = 60 * milisecondPerMinute;
  const milisecondPerDay = 24 * milisecondPerHour;

  const days = Math.floor(ms / milisecondPerDay);
  ms %= milisecondPerDay;

  const hours = Math.floor( ms / milisecondPerHour);
  ms %= milisecondPerHour;

  const minutes = Math.floor(ms / milisecondPerMinute)
  ms %= milisecondPerMinute;

  return {days, hours, minutes}

}