const Discord = require('discord.js');
const {
  prefix,
  API_TOKEN,
} = require('./config.json');
const { MessageHandler } = require('./src/handlers/MessageHandler');
const {
  VoiceChannelChangeHandler,
} = require('./src/handlers/VoiceChannelChangeHandler');
const { NewMemberAddHandler } = require('./src/handlers/NewMemberAddHandler');
const { MemberLeaveHandler } = require('./src/handlers/MemberLeaveHandler');
const { ReactionHandler } = require ('./src/handlers/ReactionHandler');


const startBot = async () => {
  const client = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.MessageContent,
      Discord.GatewayIntentBits.GuildVoiceStates,
      Discord.GatewayIntentBits.GuildMessageReactions,
      Discord.GatewayIntentBits.GuildMembers,
      Discord.GatewayIntentBits.GuildPresences,
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
  const memberLeaveHandler = new MemberLeaveHandler();
  const reactionHandler = new ReactionHandler();
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

  client.on('guildMemberRemove', (member) => {
    memberLeaveHandler.handleMemberLeave(member);
  });

  client.on('messageReactionAdd', async (reaction, user) => {
    const botpfp = client.user.displayAvatarURL();
    reactionHandler.handleReaction(reaction, user, botpfp);
  });

  client.on('messageReactionRemove', async (reaction, user) => {
    const botpfp = client.user.displayAvatarURL();
    reactionHandler.handleReaction(reaction, user, botpfp, true);
  });

  client.login(API_TOKEN);
};

startBot();
