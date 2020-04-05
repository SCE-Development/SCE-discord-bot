# SCE Discord bot

The SCE has a [discord server](https://discord.gg/e2Dsgd9) where
its members gather online. The purpose of this bot is to manage 
the Discord server with custom commands.

## How to use
1. Obtain API token from SCE slack
1. Create a `config.json` file with the similar format as `config.example.json`
1. In the terminal, run `npm start`
1. Test out the bot in the discord channel!

## Purpose of this bot

We are currently using Dyno/Tatsumaki/Reactionrole/Owobot to manage
our [Discord server](https://discord.gg/e2Dsgd9). This Discord bot
will allow us to combine the functionalities of these four bots
into one. It will also be tailored specifically towards the SCE discord
server.

## Commands to add

Administration
- Kick/Ban/Warn/etc
- Autorole functionalities

Fun commands
- Points for talking in the server
- Blackjack/slots

Custom commands
- Connect this to Core-v4 website
- Check doorcode (s!doorcode --> Bot dms you your code)
- Printing (s!print --> Pops up a series of embeds that enable you to 
print)
- Automate club event broadcasting

## Directory structure
1. src/
1. api/
1. test/

`src/` contains all the commands and bot interface
`api/` is used to connect to the website
`test/` is used for testing
