# SCE Discord bot

The SCE has a [discord server](https://discord.gg/e2Dsgd9) where
its members gather online. The purpose of this bot is to manage
the Discord server with custom commands.

## How to use

### Prerequisites

1. [npm](https://www.npmjs.com)
2. [mongoDB](https://www.mongodb.com)
3. [docker](https://www.docker.com)

### With Docker

1. Create a `.env` file with the same format as `.env.example`
   1. `MONGO_ROOT_PASSWORD` is the password for the root user on the Docker build's MongoDB database (can be set to anything for first build)
   2. `MONGO_BOT_PASSWORD` is the password for the bot to use with MongoDB (can be set to anything for first build)
2. Create a `config.json` file with the same format as `config.example.json`
   1. `API_TOKEN` is the Discord API token (ask a team member for this)
   2. `DATABASE_PASSWORD` should be the same as `MONGO_BOT_PASSWORD` from `.env`
3. In your terminal (in the root directory of the project) run `docker-compose up --build bot`
   1. Make sure Docker is running first
   2. Omit the `--build` flag to reuse an old build
4. Test out the bot in the discord channel!

### Without Docker

1. Create a `config.json` file with the same format as `config.example.json`
   1. `API_TOKEN` is the Discord API token (ask a team member for this)
   2. `DATABASE_URL` needs `mongo` replaced with `localhost` (i.e. `mongodb://localhost:27017/Discord`)
   3. `DATABASE_PASSWORD` can be whatever you want
2. Create a user for the bot in MongoDB
   1. Make sure MongoDB is running
      1. Instructions will depend on your environment
      2. Use `mongod` to start the MongoDB daemon on Linux
   2. In your terminal, open the MongoDB shell with `mongo`
   3. Type `use Discord` to create and switch to the `Discord` database
   4. Copy and paste `db.createUser({ user: 'sce-discord-bot', pwd: passwordPrompt(), roles: [{ role: 'readWrite', db: 'Discord' }] })` to create a user for the bot
   5. Set the password to whatever you have for `DATABASE_PASSWORD` from `config.json`
   6. Type `exit`
3. In your terminal (in the root directory of the project) run `npm start`
4. Test out the bot in the discord channel!

## How to set up Calendar Event API

1. Obtain API token from SCE slack
1. Create a `config.json` file with similar format as `config.example.json`
1. Locate your `Calendar ID` in you Google Calendar settings:

![image](https://user-images.githubusercontent.com/47675634/87125869-0ec97280-c240-11ea-815b-ed13596cef6b.PNG)

1. Select which calendar you want to access through the API
2. Scroll down to `Integrate Calendar` and copy your `Calendar Id`:

![image](https://user-images.githubusercontent.com/47675634/87126195-a3cc6b80-c240-11ea-96a3-24c5b91ad256.PNG)

1. Add this into your `config.json` int the `EVENTS_CAL` section
2. If you want to use your primary calendar, for `EVENTS_CAL` put `primary`
3. In the terminal, run `npm start`
4. Test out the bot in the discord channel!

## Purpose of this bot

We are currently using Dyno/Tatsumaki/Reactionrole/Owobot to manage
our [Discord server](https://discord.gg/e2Dsgd9). This Discord bot
will allow us to combine the functionalities of these four bots
into one. It will also be tailored specifically towards the SCE discord
server.

## Directory structure

1. src/
1. api/
1. test/

`src/` contains all the commands and bot interface
`api/` is used to connect to the website
`test/` is used for testing
