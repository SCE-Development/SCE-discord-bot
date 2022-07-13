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

    let isValid = await validateDiscordID( id );

    if (!isValid) {
      return reply.edit('Connect your discord account with' +
        'SCE web then try again!');
    }

    let url;
    reply.edit('Check your DM');
    await message.author.send('Please submit one file at a time!');
    const filter = collected => collected.author.id === message.author.id;
    await message.channel.awaitMessages(filter, {
      max: 1,
      time: 10000
    })
      .then(collected => {
        console.log('here');
        url = collected.first().attachments.first().url;
      })
      .catch(() => {
        message.author.send('Timeout');
      });

    let isPrinterWorking  = printerHealthCheck();

    if(!isPrinterWorking){
      return reply.edit('Printer is out of service at the moment!' +
        'Please try again later!');
    }
    const isPushDiscordPDFToSqs = pushDiscordPDFToSqs(url);

    if(!isPushDiscordPDFToSqs){
      return reply.edit('Unable to print your file! Please try again!');
    }
  }
});
