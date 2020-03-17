//LOCK NORMAL USERS FROM USING THIS!!!  
module.exports = {
	name: 'cct',
	description: 'create channel (text)',
  category: 'mod',
  aliases: [],
  permissions: 'admin',
	execute(message, args) {
    if (args.join(" ") == ""){
      message.channel.send("You need to give the name of the channel!");
      return
    }
    const author = message.member;
    var str = args.join(" ");
    //message.channel.send(author.haspermission("MANAGE_CHANNELS"))
		if (author.permissions.has("MANAGE_CHANNELS") || author.permissions.has("ADMINISTRATOR")){
      message.guild.createChannel(str);
      message.channel.send(author + " created " + str);
    }
	},
};