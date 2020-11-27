const Command = require('../Command');
module.exports = new Command({
  name: 'subscribe',
  description: 'subscribes user to discord SCE notifications',
  aliases:['sub'],
  example: '!subscribe',
  permissions:'general',
  category: 'member services',
  // eslint-disable-next-line
  execute: async (message, args) => {
    const author = message.member; 
    const { roles } = message.guild; 
        
    let classRole = roles.array().filter(
      (x) => x.name == 'Notification'
    );
    if(classRole.length ==0){
      message.channel.send('The Notification role has not been setup');
      return;
    }   
    let targetRole = classRole[0];
    await author.addRole(targetRole)
      .then(() =>
        message.channel.send(author +
           ' has subscribed to all SCE Discord Notifications'))
      .catch(() =>
        message.channel.send('Could not add role'));
  }
});
