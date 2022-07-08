const Discord = require('discord.js');
const client = new Discord.Client();
const {API_TOKEN, CORE_V4_API_KEY} = require('../../config.json');
const SendFileURL = require('../APIFunctions/SendFileURL');

async function PrintRequestHandler() {
  let fileURL = '';
  client.login(API_TOKEN);
  client.on('message', async (message) => {

    const fileArray = [...message.attachments];

    if (fileArray.length === 1){

      fileURL = fileArray[0][1].attachment;

      let checkURL = {
        url: fileURL, 
        apiKey: CORE_V4_API_KEY
      };
      
      const response = await SendFileURL(checkURL);
      
      if(response.error){
        message.author.send('Invalid API Key! Unable to print!');
      } else{
        message.author.send('Printing...');
      }
      
    }
      
  });
}

module.exports = PrintRequestHandler;
