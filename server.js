const {
  prefix,
  API_TOKEN,
  DATABASE_URL,
  DATABASE_USER,
  DATABASE_PASSWORD,
} = require('./config.json');
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { schema } = require('./api/resolvers/index.js');
const bodyParser = require('body-parser');
const { SceBot } = require('./src/SceBot');
const port = 5000;

const startBot = async () => {
  const sceBot = new SceBot({ API_TOKEN, prefix });
  sceBot.initialize();
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
