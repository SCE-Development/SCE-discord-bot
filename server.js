const Discord = require('discord.js');
const { prefix, API_TOKEN } = require('./config.json');
const { CommandHandler } = require('./src/CommandHandler');
const { VoiceChannelChangeHandler } = 
require('./src/VoiceChannelChangeHandler');

const startBot = async () => {
  const client = new Discord.Client();
  const commandHandler = new CommandHandler('./commands', prefix);
  const vcChangeHandler = new VoiceChannelChangeHandler();
  client.once('ready', () => {
    commandHandler.initialize();
    client.user.setActivity('Managing the SCE');
    console.log('Ready');
  });

  client.on('message', message => {
    commandHandler.handleMessage(message);
  });

  client.on('voiceStateUpdate', (oldMember, newMember) => {
    vcChangeHandler.handleChangeMemberInVoiceChannel(oldMember, newMember);
  });

  client.login(API_TOKEN);
};

startBot();
