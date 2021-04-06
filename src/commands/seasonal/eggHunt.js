const Command = require('../Command');
const {
  startEgghunt,
  stopEgghunt,
  displayEggs,
  CreateEgg,
} = require('./eggSwitch');

module.exports = new Command({
  name: 'egghunt',
  description: 'Can you find the eggs.',
  aliases: ['egg'],
  example: 's!egghunt -------',
  permissions: 'general',
  category: 'Seasonal Game',
  disabled: false,
  execute: (message, args) => 
  {
    
    console.log(args);
    if(args[0] === 'admin')
    {
      switch(args[1])
      {
        case 'start':
          if(args[2] === undefined)
          {
            message.channel.send('type in a channel name');
            return;
          } 
          startEgghunt(args[2], message.guild);
          break;
        case 'stop':
          stopEgghunt(message.guild, args[2]);
          break;
        case 'add':
          CreateEgg(message.channel, message.author.id);
          break;
        default:
          console.log("Type valid");
      }
    }
    else
    {
      let mode = undefined; 
      switch(args[0])
      {
        case 'leaderboard':
          mode = 'leader';
        case 'eggs':
          mode = mode === undefined ? 'hidden' : mode;
        case 'basket':
          mode = mode === undefined ? 'caught' : mode;
        default:
          displayEggs(message.author.id,message.guild.id, message.channel, mode);
      }
    } 
  }
});
