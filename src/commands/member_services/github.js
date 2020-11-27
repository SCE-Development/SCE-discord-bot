const Discord = require('discord.js');
const Command = require('../Command');
const { GithubMessageGenerator } = require('../../util/GithubMessageGenerator');

/**
 * commands that grabs Github data from SCE server
 * pr <repoName> -> Open Pull Requests
 * leaderboard <repoName> -> Top 5 contributors
 * commits <repoName> <numOfCommits> -> Merged Commits
 */
module.exports = new Command({
  name: 'github',
  description: 'Displays following information from SCE github repos:\
  Contributor leaderboard, Pull requests, merged commits',
  aliases: ['git'],
  example: 's!git',
  permissions: 'general',
  category: 'github',
  disabled: false,
  execute: (message, args) => {
    const messageGenerator = new GithubMessageGenerator();

    switch (args[0]) {
      case 'pr':
        messageGenerator.generatePullRequestMessage(args[1])
          .then(prMessage => {
            message.channel.send(prMessage);
          })
          .catch(_ => {
            message.channel.send(_);
          });
        break;

      case 'leaderboard':
        messageGenerator.generateLeaderboardMessage(args[1])
          .then(leaderboardMessage => {
            const leaderboardEmbed = new Discord.RichEmbed()
            .setColor('#ccffff');
            leaderboardMessage.forEach(embed => {
              let name = embed.author.name;
              let commits = embed.description;
              leaderboardEmbed.addField(name, commits);
            });
            message.channel.send(leaderboardEmbed);
          })
          .catch(_ => {
            message.channel.send(_);
          });
        break;

      case 'commits':
        // Check if 3rd argument (optional) is a number
        if (args[2] && isNaN(args[2])) {
          message.channel.send(
            `Invalid Value: ${args[2]} Please enter a number`
          );
          break;
        }
        messageGenerator.generateCommitMessage(args[1], args[2])
          .then(commitMessage => {
            message.channel.send(commitMessage);
          })
          .catch(_ => {
            message.channel.send(_);
          });
        break;

      default:
        // Help
        message.channel.send(
          new Discord.RichEmbed()
            .setDescription('Unrecognized parameter try using:')
            .addField('pr <repo>', 'View pull requests')
            .addField('leaderboard <repo>', 'Top 5 contributors')
            .addField(
              'commits <repo> <num>',
              'Merged commits - <num> (optional, Limit: 25)'
            )
        );
    }
  },
});

