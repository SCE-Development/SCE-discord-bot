# SCE Discord bot

The SCE has a [discord server](https://discord.gg/e2Dsgd9) where
its members gather online. The purpose of this bot is to manage 
the Discord server with custom commands.

## How to use
1. Obtain API token from SCE slack
1. Create a `config.json` file with the similar format as `config.example.json`
1. In the terminal, run `npm start`
1. Test out the bot in the discord channel!

## How to set up Calendar Event API
1. Obtain API token from SCE slack
1. Create a `config.json` file with similar format as `config.example.json`
1. Locate your `Calendar ID` in you Google Calendar settings:

![image](https://user-images.githubusercontent.com/47675634/87125869-0ec97280-c240-11ea-815b-ed13596cef6b.PNG)

1. Select which calendar you want to access through the API
1. Scroll down to `Integrate Calendar` and copy your `Calendar Id`:

![image](https://user-images.githubusercontent.com/47675634/87126195-a3cc6b80-c240-11ea-96a3-24c5b91ad256.PNG)

1. Add this into your `config.json` int the `EVENTS_CAL` section
1. If you want to use your primary calendar, for `EVENTS_CAL` put `primary`
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
