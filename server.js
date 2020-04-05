const Discord = require('discord.js');
const { prefix, API_TOKEN } = require('./config.json');
const { CommandHandler } = require('./src/CommandHandler');

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

client.login(API_TOKEN);
