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
    //  send the botStartTime to the channel
    const today = new Date();
    //  get the bot start time from the message object
    //  calculate the difference between the current time and the bot start time
    const diffDate = today - message.botStartTime;
    //  convert the difference to ISO format
    const {days, hours, minutes} = converMSToISO(diffDate);
    const returnedDay = `${days} ${days > 1 ? 'days' : 'day'}`;
    const returnedHour = `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
    const returnedMinute = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    const botStartTimeISO = message.botStartTime.toISOString();
    const returnedMsg = `up ${returnedDay}, ${returnedHour}, ${returnedMinute} since ${botStartTimeISO}`;
    //  send the message to the channel
    message.channel.send(`\`\`\`${returnedMsg}\`\`\``);
  }
});

const converMSToISO = (ms) => {
  const milisecondPerMinute = 60000;
  const milisecondPerHour = 60 * milisecondPerMinute;
  const milisecondPerDay = 24 * milisecondPerHour;

  const days = Math.floor(ms / milisecondPerDay);
  ms %= milisecondPerDay;

  const hours = Math.floor( ms / milisecondPerHour);
  ms %= milisecondPerHour;

  const minutes = Math.floor(ms / milisecondPerMinute);
  ms %= milisecondPerMinute;

  return {days, hours, minutes};
};