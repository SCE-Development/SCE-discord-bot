const Command = require('../Command');
<<<<<<< HEAD
const { spawn } = require('child_process');
=======
const { spawn } = require('child_process')
>>>>>>> 245e3fc5d249c98c0974710c47bd2227ab3d1589
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
<<<<<<< HEAD
    const process = spawn(
      'python3', 
      ['./py_runner.py', args[0], args[1]],
      {cwd:'/bot/src/commands/util', timeout: 5000}
    );
    process.stdout.on('data', (data) => {stdout.push(data);});
    process.stderr.on('data', (data) => {stderr.push(data);});
=======
    var exit;
    const process = spawn('python3', ['./py_runner.py',args[0], args[1]], {cwd:'/bot/src/commands/util', timeout: 5000});
    process.on('close', (code) => { exit = `exited with code ${code}`  });
    process.stdout.on('data', (data) => {stdout.push(data)});
    process.stderr.on('data', (data) => {stderr.push(data)});
>>>>>>> 245e3fc5d249c98c0974710c47bd2227ab3d1589
    setTimeout(() => {
      if(!process.killed) {
        process.kill();
      }
<<<<<<< HEAD
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
=======
      let combine = ''
      combine = combine + "+ STDOUT:\n"
      stdout.forEach((str) => {combine = combine.concat(str);});
      combine = combine + "\n- STDERR:\n"
      stderr.forEach((str) => combine = combine.concat(str));
      while(combine.indexOf('```') >=  0){ combine = combine.replace('```', "'''");}
      spli = combine.split('\n');
      spli = spli.slice(Math.max(0, spli.length-20));
      combine = spli.join('\n');
      combine = "```diff\n" + combine + "```";
      const embed = new Discord.MessageEmbed().setTitle("Output:").setDescription(combine);
      message.channel.send(embed);
    }, 1000);
  },
});
>>>>>>> 245e3fc5d249c98c0974710c47bd2227ab3d1589
