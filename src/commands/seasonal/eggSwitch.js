const Command = require('../Command');
const Discord = require('discord.js');

var runningIntervals = {};

function startEgghunt(channelName, guild)
{
    if(guild === undefined) return;
    if(!guild.available) return;
    let channel = guild.channels.find(channel => channel.name === channelName);
    let interval = eggGenerator(10000, channel);
    runningIntervals[channelName] = interval;
    
}

function stopEgghunt(channelName, guild)
{
    if(guild === undefined) return;
    if(!guild.available) return;
    clearInterval(runningIntervals[channelName]);
    delete runningIntervals[channelName];
}
function stopEgghunt(guild)
{
    if(guild === undefined) return;
    if(!guild.available) return;
    for(var channelName in runningIntervals)
    {
        console.log(channelName);
        clearInterval(runningIntervals[channelName]);
        delete runningIntervals[channelName];
    }

}
/**
 * 
 * @param {Number} delayValue 
 */
function eggGenerator(delayValue, channel)
{
    function egg(){
        channel.send("egg " + new Date().toLocaleTimeString());
    }
    
    return setInterval(egg, delayValue);
}
module.exports = {
    startEgghunt,
    eggGenerator,
    stopEgghunt,
}