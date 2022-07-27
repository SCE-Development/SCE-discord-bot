const Command = require('../Command');
const { getPdfNumOfPages } = require('../util/getPdfNumOfPages');
const {
  validateDiscordID,
  printerHealthCheck,
  pushDiscordPDFToSqs,
  editUserPagesPrinted
} = require('../../APIFunctions/Print.js');

module.exports = new Command({
  name: 'print',
  description: 'Print PDF file',
  aliases: ['print'],
  example: 's!print',
  permissions: 'member',
  category: 'member services',

  // eslint-disable-next-line no-unused-vars
  execute: async (message, args) => {
    const { id } = message.author;

    const reply = await message.channel.send('Authenticating Print Request.');

    let {isValid, pagesPrinted} = await validateDiscordID( id );
    if (!isValid) {
      return reply.edit('Connect your discord account with ' +
        'SCE web then try again!');
    }

    let url;
    let timeout = false;
    reply.edit('Check your DM');
    await message.author.send('Please submit one file at a time!');
    const filter = collected => collected.author.id === message.author.id;
    await message.channel.awaitMessages(filter, {max: 1, time: 15000})
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

      let pdfPages = await getPdfNumOfPages(url);
      reply.edit('Processing request...');

      const updateNumberOfPages = pagesPrinted + pdfPages;

      if(updateNumberOfPages>30){
        return reply.edit(
          `You have already printed ${pagesPrinted} pages`+
          ` and you are trying to print ${pdfPages} pages` + 
          'exceeding the 30 pages per week limit!'
        );
      }

      const newNumberOfPages = 
   await editUserPagesPrinted(id, updateNumberOfPages);
      if(!newNumberOfPages){
        return reply.edit(
          'Something went horribly wrong!'
          + 'Try again. If it fails again, contact SCE staff!');
      }

      const isPushDiscordPDFToSqs = pushDiscordPDFToSqs(url); 
      if(!isPushDiscordPDFToSqs){ 
        return  reply.edit('Unable to print your file! Please try again!');
      }
      
      return message.author.send('Printing...');
    } else {
      reply.edit('Your time is up! Type "s!print"' +
      'command again to restart printing process!');
    }
  }
});
