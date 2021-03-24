const Command = require('../Command');
const Discord = require('discord.js');
const { Egg } = require('../../util/eggUtils');
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

module.exports = {
    startEgghunt,
    stopEgghunt,
}