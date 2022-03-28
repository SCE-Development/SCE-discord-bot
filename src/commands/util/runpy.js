const Command = require('../Command');
const { spawn } = require('child_process');
const Discord = require('discord.js');

module.exports = new Command ({
  name: 'runpy',
  description: 'Runs a Python Script',
  aliases: [],
  example: 's!runpy ```PROGRAM``` ```INPUT```',
  permission: 'general',
  category: 'information',
  execute: async (message, args) => {
    const stdout = [];
    const stderr = [];
    const process = spawn(
      'python3', 
      ['./py_runner.py', args[0], args[1]],
      {cwd:'/bot/src/commands/util', timeout: 5000}
    );
    process.stdout.on('data', (data) => {stdout.push(data);});
    process.stderr.on('data', (data) => {stderr.push(data);});
    setTimeout(() => {
      if(!process.killed) {
        process.kill();
      }
      let combine = '';
      combine = combine + '+ STDOUT:\n';
      stdout.forEach((str) => {combine = combine.concat(str);});
      combine = combine + '\n- STDERR:\n';
      stderr.forEach((str) => combine = combine.concat(str));
      while(combine.indexOf('```') >=  0) { 
        combine = combine.replace('```', '\'\'\'');
      }
      let spli = combine.split('\n');
      spli = spli.slice(Math.max(0, spli.length-20));
      combine = spli.join('\n');
      combine = '```diff\n' + combine + '```';
      const embed = new Discord.MessageEmbed();
      embed.setTitle('Output:').setDescription(combine);
      message.channel.send(embed);
    }, 1000);
  },
});
