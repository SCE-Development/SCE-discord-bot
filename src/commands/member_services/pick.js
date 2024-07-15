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
    // step 1:
    // we have an array like
    // args: [ 'one', '|', 'two', '|', 'three' ]
    // the choices are divided by a veritcal line
    // we need to remove the vertical line from the array, 
    // and then pick a choice from the array
    // i.e. pick 'one', 'two', or 'three', 
    // then reply the choice to the user

    // step 2
    // the user called the command like 
    // `s!pick pizza | french fries | cold water
    
    // we have an array like
    // args: [ 'pizza', '|', 'french', 'fries', '|', 'cold', 'water' ]
    // the choices are still divided by a veritcal line
    // before removing a vertical line from the array, 
    // we also need to "group" the choices together
    // the choices in this case are 'pizza', 'french fries' and 'cold water'
    // pick a choice from the above, then reply the choice to the user

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

    if (args.length > 1) {
      args.forEach(arg => {
        // if the string contains a '|', ignore it
        if (arg === '|')
        {
          names.push(currName);
          console.log({names});
          currName = '';
        }
        else{
          currName += ` ${arg}`;
        }
      });
      names.push(currName);
      console.log({names});
      console.log({args});
      let rand = randomize(names.length);
      let winner = names[rand];
      message.channel.send(`🤔 |  ${message.member}, I pick${winner}!`);
        
    }
    
    else {
      message.channel.send(`❌ | ${message.member}, 
          You need to have 2 or more names in the raffle`);
    }
  }
});
