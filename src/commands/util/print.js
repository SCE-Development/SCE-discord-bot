const Command = require('../Command');

const CheckDiscordID = require('../../APIFunctions/CheckDiscordID');
const SendFileURL = require('../../APIFunctions/SendFileURL');
const {DISCORD_SECRET_KEY} = require('../../../config.json');

module.exports = new Command({
  name: 'print',
  description: 'Print PDF file',
  aliases: [],
  example: 's!print',
  permissions: 'general',
  category: 'information',
  // eslint-disable-next-line
  execute: async (message, args) => {

    const userID = message.author.id;
    const filesArray = [...message.attachments];
    const checkingInProcess = await message.channel.send('Checking user ID...');
    if(filesArray.length < 2){
      const url = filesArray[0][1].url;
     
      const checkUser = {
        discordID: userID,
      };
      const checkURL = {
        url: url,
        apiKey: DISCORD_SECRET_KEY
      };
      
      const {exist, mess}  = await CheckDiscordID.checkID(checkUser);
    
      if(exist){
        const response = await SendFileURL.allowPrinting(checkURL);
          
        if(response.error){
          checkingInProcess.edit('Invalid API Key! Unable to print!');
        } else{
          checkingInProcess.edit(mess);
          message.channel.send('Printing...');
        }

      } else{
        checkingInProcess.edit(mess);
      }
    } else {
      checkingInProcess.edit('You can only print one file at a time!');
    }
  },
});
