const Discord = require('discord.js');
const { prefix, API_TOKEN } = require('./config.json');
const { CommandHandler } = require('./src/CommandHandler');
const {
  VoiceChannelChangeHandler
} = require('./src/VoiceChannelChangeHandler');
const mongoose = require('mongoose');

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

// Conenct to mongoose
const startDatabase = async () => {
  await mongoose.connect('mongodb://localhost/Discord', {
    autoIndex: true,
    poolSize: 50,
    bufferMaxEntries: 0,
    keepAlive: 120,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.set('useCreateIndex', true);
  mongoose.connection.once('open', () => {
    console.log('Connected to Mongo');
  });
};

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true
  });
  // Express app
  const app = express();

  server.applyMiddleware({ app });

  // start app
  app.listen(5000, () => console.log('Server running'));
};


startBot();
startDatabase();
startServer();
