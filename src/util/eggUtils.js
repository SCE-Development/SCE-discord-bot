const Discord = require('discord.js');

class Egg {
    delayRange = [1000, 2000];
    channel = undefined;
    guild = undefined;
    timeout = undefined;
    eggPics = ['pics/Egg1.png', 'pics/Egg2.png', 'pics/Egg3.png'];
    
    constructor(delayTime, channel, guild)
    {
        this.delayRange = [delayTime * 0.68, delayTime * 1.4];
        this.channel = channel;
        this.guild = guild;
        this.timeout = undefined;
    }

    async start(delayTime)
    {
        if(this.channel === undefined) return;
        if(delayTime != undefined) this.delayRange = [delayTime * 0.4, delayTime * 1.4];
        let randomDelay = Math
            .floor(Math.random() * (this.delayRange[1] - this.delayRange[0]) + this.delayRange[0]);

        let choice = Math.floor(Math.random() * 3);
        const eggEmbed = new Discord.RichEmbed()
        .setTitle('Egg!Egg!')
        .setDescription('Hey look an egg!')
        .attachFile(this.eggPics[choice])
        .setThumbnail('attachment://' + this.eggPics[choice]);
        let sentMessage = await this.channel.send(eggEmbed);
        await sentMessage.react('🐰');

        const filter = (reaction, user) => {
            return (
              ['🐰'].includes(reaction.emoji.name) &&
              !user.bot
            );
        }
        let collector = await sentMessage.createReactionCollector(filter, {
            max: 1,
            time: randomDelay * 1.4,
            errors: ['time'],
          });

          const collectReaction = async (reaction) => {
            let user = reaction.users.last();
            let userId = user.id;
            this.channel.send(`\`${user.username}\` has taken the egg!`);
            }
        collector.once('collect', collectReaction);
        this.timeout = setTimeout(this.start.bind(this), randomDelay);
    }

    stop()
    {
        if(this.timeout === undefined) return;
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
    
}

module.exports = {
    Egg
}