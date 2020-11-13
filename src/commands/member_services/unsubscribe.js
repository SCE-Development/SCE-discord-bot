const Command = require('../Command');
module.exports = new Command({
    name: 'unsubscribe',
    aliases:['unsub'],
    description: 'unsubscribes user from discord SCE notifications',
    example: '!unsubscribe',
    permissions:'general',
    category: 'member services',
    execute: async (message, args) => {
        const author = message.member; 
        const { roles } = message.guild; 
        
        let classRole = roles.array().filter(
          (x) => x.name == "Notification"
        );
        if(classRole.length ==0){
            message.channel.send("The Notification role has not been setup");
            return;
        }   
        let targetRole = classRole[0];
        await author.removeRole(targetRole)
        .then(() =>
          message.channel.send(author + ` has unsubscribed from all SCE Discord Notifications`))
        .catch(() =>
          message.channel.send("Could not remove role"));
    }
});
