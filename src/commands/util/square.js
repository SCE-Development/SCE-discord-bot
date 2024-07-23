const Command = require('../Command');

module.exports = new Command({
  name: 'square',
  description: 'Check if the bot is up',
  aliases: [],
  example: 's!square',
  permissions: 'general',
  category: 'information',
  // eslint-disable-next-line
    execute: async (message, args) => {

    if (args.length === 0) {
      return message.channel.send('Please provide a number to square');
    }

    const num = parseInt(args);

    if (isNaN(num)) {
      return message.channel.send('Please provide a valid number');
    }

    const squared = num * num;

    return message.channel.send(`${num} squared is ${squared}`);


        

  },
});



  
