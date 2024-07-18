const Command = require('../Command');

module.exports = new Command({
  name: 'pick',
  description: 'Start a raffle, given a list of names.\
  They can ping the bot and pick a person.',
  aliases: [],
  example: 's!pick',
  permissions: 'member',
  category: 'member services',
  disabled: false,
  execute: async (message, args) => 
  {
    const names = [];
    let currName = '';
    /* 
    initialize names with list of names
    use math.rand to pick a name in the list
    
      */
    function randomize(number) {
      let result = Math.floor( Math.random() * (number - 1) );
      return result;
    }

    if (args.length <= 1 || !args.includes('|')) 
    {
      message.channel.send(`❌ | ${message.member}, 
        You need to have 2 or more names in the raffle, 
        AND separate the items with a '|'`);
      return;
    }
    
    args.forEach(arg => {
      // if the string contains a '|', ignore it
      if (arg === '|')
      {
        names.push(currName);
        currName = '';
      } else {
        currName += ` ${arg}`;
      }
    });
    names.push(currName);

    let rand = randomize(names.length);
    let winner = names[rand];
    message.channel.send(`🤔 |  ${message.member}, I pick${winner}!`);

  }
});
