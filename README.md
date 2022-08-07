# SCE Discord bot

The SCE has a [discord server](https://discord.gg/e2Dsgd9) where
its members gather online. The purpose of this bot is to manage
the Discord server with custom commands.

## How to use

### Prerequisites

1. [npm](https://www.npmjs.com)
2. [docker](https://www.docker.com)

### With Docker
1.  Create a `config.json` file with the same format as `config.example.json`
2. `API_TOKEN` is the Discord API token (ask a team member for this)
3. In your terminal (in the root directory of the project) run `docker-compose up --build bot`
   1. Make sure Docker is running first
   2. Omit the `--build` flag to reuse an old build
4. Test out the bot in the discord channel!

### Without Docker

1. Create a `config.json` file with the same format as `config.example.json`
   1. `API_TOKEN` is the Discord API token (ask a team member for this)
3. In your terminal (in the root directory of the project)
   1. run `npm install`
   2. run `npm start`
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
