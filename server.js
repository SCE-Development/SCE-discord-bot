const Discord = require('discord.js');
const { prefix, API_TOKEN } = require('./config.json');
const { CommandHandler } = require('./src/CommandHandler');
const { handleChangeVoiceChannel } = require('./src/commands/member_services/setvoicetopic');

const startBot = async () => {
  const client = new Discord.Client();
  const commandHandler = new CommandHandler('./commands', prefix);
  client.once('ready', () => {
    commandHandler.initialize();
    client.user.setActivity('Managing the SCE');
    console.log('Ready');
  });

  client.on('message', message => {
    commandHandler.handleMessage(message);
  });

  client.on("voiceStateUpdate", function(oldMember, newMember){
    handleChangeVoiceChannel(oldMember, newMember);
  });

  client.login(API_TOKEN);
};

startBot();