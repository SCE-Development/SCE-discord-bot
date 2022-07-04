const Command = require('../Command');

const snowboardEmoji = '🏂';
const clockEmoji = '🕑';
const TestHawk = require('../../APIFunctions/TestHawk');
const PrinterTestHawk = require('../../APIFunctions/PrinerTestHawk');

module.exports = new Command({
  name: 'ok',
  description: 'Check if the bot is up',
  aliases: [],
  example: 's!ok',
  permissions: 'general',
  category: 'information',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const userID = message.author.id;
    // const file = message.author.lastMessageID;
    const filesArray = message.attachments.entries();
    const url = filesArray.next().value[1].url;

    // entries return an array of [key,value] 
    // we can use iterator to go through the array 
    const checkUser = {
      discordID: userID,
    };

    const checkingInProcess = await message.channel.send('Checking user ID...');
    const {mess}  = await TestHawk.checkID(checkUser);

    if(mess === 'User exists'){
      PrinterTestHawk.allowPrinting(url);
    }

    checkingInProcess.edit(mess);

    const pingResponse = await message.channel.send(
      `Calculating latency... ${snowboardEmoji}`
    );
    const messageLatency =
      pingResponse.createdTimestamp - message.createdTimestamp;
    pingResponse.edit(`Pong! Latency is ${messageLatency} ms ${clockEmoji}.`);
  },
});
