const Command = require('../Command');

const snowboardEmoji = '🏂';
const clockEmoji = '🕑';
const attachment =
  'https://cdn.discordapp.com/attachments/745444200996274236/985281923813343242/blank.pdf';

const TestHawk = require('../../APIFunctions/TestHawk');
const { response } = require('express');

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
    const file = message.author.lastMessageID;
    const filesArray = message.attachments.entries();
    const url = filesArray.next().value[1].url;
    const flag = true;
    //entries return an array of [key,value]
    //we can use iterator to go through the array
    const checkUser = {
      discordID: userID,
    };

    const checkingInProcess = await message.channel.send('Checking user ID...');
    const {mess}  = await TestHawk.checkID(checkUser);
    console.log(mess)
    checkingInProcess.edit(mess);

    const pingResponse = await message.channel.send(
      `Calculating latency... ${snowboardEmoji}`
    );
    const messageLatency =
      pingResponse.createdTimestamp - message.createdTimestamp;
    pingResponse.edit(`Pong! Latency is ${messageLatency} ms ${clockEmoji}.`);
  },
});
