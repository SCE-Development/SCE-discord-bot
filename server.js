const Discord = require('discord.js');
const {
  prefix,
  API_TOKEN,
  DATABASE_URL,
  DATABASE_USER,
  DATABASE_PASSWORD,
} = require('./config.json');
const { MessageHandler } = require('./src/handlers/MessageHandler');
const {
  VoiceChannelChangeHandler,
} = require('./src/handlers/VoiceChannelChangeHandler');
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { schema } = require('./api/resolvers/index.js');
const bodyParser = require('body-parser');
const { NewMemberAddHandler } = require('./src/handlers/NewMemberAddHandler');
const port = 5000;

const startBot = async () => {
  const client = new Discord.Client();
  const messageHandler = new MessageHandler(prefix);
  const vcChangeHandler = new VoiceChannelChangeHandler();
  const newMemberHandler = new NewMemberAddHandler();
  client.once('ready', () => {
    messageHandler.initialize();
    client.user.setPresence({
      game: {
        name: `${prefix}help`,
        type: 'LISTENING',
      },
    });
    console.log('Discord bot live');
  });

  client.on('message', message => {
    messageHandler.handleMessage(message);
  });

  client.on('voiceStateUpdate', (oldState, newState) => {
    vcChangeHandler.handleChangeMemberInVoiceChannel(oldState, newState);
  });

  client.on('guildMemberAdd', newMember => {
    newMemberHandler.handleNewMember(newMember);
  });

  client.login(API_TOKEN);
};

// Connect to mongoose
const startDatabase = () => {
  mongoose.connect(DATABASE_URL, {
    autoIndex: true,
    poolSize: 50,
    bufferMaxEntries: 0,
    keepAlive: 120,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    user: DATABASE_USER,
    pass: DATABASE_PASSWORD,
  });
  mongoose.connection.once('open', () => console.log('Connected to Mongo'));
};

const startServer = async () => {
  const server = new ApolloServer({ schema });
  // Express app
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));

  server.applyMiddleware({ app });

  // start app
  app.listen(port, () => console.log(`Server running at port ${port}`));
};

startBot();
startDatabase();
startServer();
