const Command = require('../Command');

const {
  validateDiscordID,
  printerHealthCheck,
  pushDiscordPDFToSqs
} = require('../../APIFunctions/Print.js');

module.exports = new Command({
  name: 'print',
  description: 'Print PDF fileURL',
  aliases: ['print'],
  example: 's!print',
  permissions: 'member',
  category: 'member services',

  // eslint-disable-next-line no-unused-vars
  execute: async (message, args) => {
    const { id } = message.author;
    
    const reply = await message.channel.send('Authenticating Print Request.');

    // eslint-disable-next-line no-unused-vars
    let {isValid, pagesPrinted} = await validateDiscordID( id );

    if (!isValid) {
      return reply.edit('Connect your discord account with' +
        'SCE web then try again!');
    }

    let url;
    let timeout = false;
    reply.edit('Check your DM');
    await message.author.send('Please submit one file at a time!');
    const filter = collected => collected.author.id === message.author.id;
    await message.channel.awaitMessages(filter, {
      max: 1,
      time: 10000
    })
      .then(collected => {
        url = collected.first().attachments.first().url;
      })
      .catch(() => {
        timeout = true;
      });
    
    if (!timeout){
      let isPrinterWorking  = printerHealthCheck();

      if(!isPrinterWorking){
        return reply.edit('Printer is out of service at the moment!' +
        'Please try again later!');
      }
      // get number of pages from user, already sent 
      // via checkDiscordAPI endpoint
      // calculate number of pages
      // subtract and update page count of the user via User.edit api endpoint

      // 1. write api function for User.edit (done)
      // 2. update checkDiscordAPI api function to return 
      // the number of pages along with the boolean value (done)
      // 3. update documetation
      // 4. commit and push
      const isPushDiscordPDFToSqs = pushDiscordPDFToSqs(url);

      if(!isPushDiscordPDFToSqs){
        return reply.edit('Unable to print your file! Please try again!');
      }
      return message.author.send('Printing...');
    }
    
  }
});
