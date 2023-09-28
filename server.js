const Discord = require('discord.js');
const {
  prefix,
  API_TOKEN,
  VERIFICATION = {}
} = require('./config.json');
const { MessageHandler } = require('./src/handlers/MessageHandler');
const {
  VoiceChannelChangeHandler,
} = require('./src/handlers/VoiceChannelChangeHandler');
const { NewMemberAddHandler } = require('./src/handlers/NewMemberAddHandler');



const startBot = async () => {
  const client = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.MessageContent,
      Discord.GatewayIntentBits.GuildVoiceStates,
      Discord.GatewayIntentBits.GuildMessageReactions,
    ],
    partials:
      [
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.Reaction],
  });
  const messageHandler = new MessageHandler(prefix);
  const vcChangeHandler = new VoiceChannelChangeHandler();
  const newMemberHandler = new NewMemberAddHandler();
  client.once('ready', () => {
    messageHandler.initialize();
    client.user.setPresence({
      activity: {
        name: `${prefix}help`,
        type: 'LISTENING',
      },
    });
    console.log('Discord bot live');
  });

  client.on('messageCreate', (message) => {
    messageHandler.handleMessage(message);
  });

  client.on('voiceStateUpdate', (oldState, newState) => {
    vcChangeHandler.handleChangeMemberInVoiceChannel(oldState, newState);
  });

  client.on('guildMemberAdd', (newMember) => {
    newMemberHandler.handleNewMember(newMember);
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    // can replace this msg id to a specfic msg to listen for reactions
    if (reaction.message.id === VERIFICATION.MESSAGE_ID) {
      // get member
      const member = reaction.message.guild.members.cache.get(user.id);
      // can replace this id to a specific role id from discord server
      const role = reaction.message.guild.roles.cache.get(
        VERIFICATION.VERIFIED_ROLE_ID
      );
      member.roles.add(role);
    }
  });

  client.login(API_TOKEN);
};

startBot();
