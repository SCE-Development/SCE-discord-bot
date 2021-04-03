const Command = require('../Command');
const Discord = require('discord.js');
const { Egg } = require('../../util/eggUtils');
const { pagination } = require('../../util/dataDisplay')
var runningIntervals = {};

function startEgghunt(channelName, guild)
{
    if(guild === undefined) return;
    if(!guild.available) return;
    let channel = guild.channels.find(channel => channel.name === channelName);
    if(!channel) return;
    runningIntervals[channelName] = new Egg(20000, channel, guild);
    runningIntervals[channelName].start();
}

function stopEgghunt(guild, channelName)
{
    if(guild === undefined) return;
    if(!guild.available) return;
    console.log(channelName);
    if (channelName !== undefined)
    {
        runningIntervals[channelName].stop();
        delete runningIntervals[channelName];
    }
    else
    {
        for(var channelName in runningIntervals)
        {
            if(runningIntervals[channelName] != undefined)
            {
                console.log(channelName);
                runningIntervals[channelName].stop();
                delete runningIntervals[channelName];
            }
        }
    }
}

async function displayEggs(userID, guildID, channel, type)
{
    if(type === undefined) return;
    let templateEmbed = new Discord.RichEmbed();
    let Query; 
    switch(type)
    {
        case 'caught':
            templateEmbed.setTitle('How many eggs do you have?')
                .setDescription('1 egg 2 egg red egg blue egg ' + userID);
            //Query = await QUERY_BASKET(userID);
            break;
        case 'hidden':
            templateEmbed.setTitle('Eggs where!?')
                .setDescription('egg there egg here egg in the grassy pear ' + guildID);
            //Query = await QUERY_EGG(guildID);
            break;
        case 'leader':
            templateEmbed.setTitle('Eggs kingdom')
                .setDescription('eggy mceggster '+ guildID);
            //Query = await QUERY_EGG(guildID);
            break;
    }
    let items = [];
    for(i =0; i<10; i++)
    {
        let testInput = {}
        testInput['title'] = 'egg' + i;
        testInput['field'] = 'EGG!!!!!!!!!!!!!!!';
        items.push(testInput);
    }
    pagination(templateEmbed, channel, userID, items);
}

module.exports = {
    startEgghunt,
    stopEgghunt,
    displayEggs,
}