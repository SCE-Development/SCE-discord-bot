module.exports = {
	name: 'ping',
	description: 'check if the bot is up',
  category: 'information',
  aliases: [],
  permissions: 'general',
	execute(message, args) {
		message.channel.send("pong");
	},
};