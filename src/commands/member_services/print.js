const Command = require('../Command');
const CheckDiscordID = require('../../APIFunctions/CheckDiscordID');
const {CORE_V4_API_KEY} = require('../../../config.json');
const PrintRequestHandler = require('../../util/PrintRequestHandler');

module.exports = new Command({
  name: 'print',
  description: 'Print PDF file',
  aliases: ['print'],
  example: 's!print',
  permissions: 'member',
  category: 'member services',
  
  // eslint-disable-next-line
  execute: async (message, args) => {
  
    const userID = message.author.id;
    const checkingInProcess = await message.channel.send('Checking user ID...');
    const checkUser = {
      discordID: userID,
      apiKey: CORE_V4_API_KEY
    };
    
    const {exist, mess}  =
     await CheckDiscordID.checkDiscordConnection(checkUser);
    if(exist){
      checkingInProcess.edit(mess);
      message.author.send('Submit 1 file at a time');
      PrintRequestHandler();
    } else{
      checkingInProcess.edit('Unauthorized' +
        ' make sure SCE web account connected');
    }
    
  },
});
