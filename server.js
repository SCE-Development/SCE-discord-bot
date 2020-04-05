const fs = require('fs');
const Discord = require('discord.js');
const { prefix, API_TOKEN } = require('./config.json');
const requireDir = require('require-dir');
const Command = require('./src/commands/Command')

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = requireDir('./src/commands', { recurse: true });

for (const directory in commandFiles) {
    for (const file in commandFiles[directory]) {
        const command = require(`./src/commands/${directory}/${file}`);
        if (command instanceof Command) {
            client.commands.set(command.name, command);
        }
    }
}

client.once('ready', () => {
    console.log('Ready')
    client.user.setActivity('Managing the SCE')
})

client.on('message', message => {
    //prevent bot from calling itself
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) { return; }


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    //spam block for commands
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id)
            + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)}
             more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args)
    } catch (Exception) { }

});

client.login(API_TOKEN)
