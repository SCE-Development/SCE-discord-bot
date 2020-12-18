const Discord = require('discord.js');
const { GithubFetcher } = require('./GithubFetcher');

/**
 * Class formats the Github embed messages that are sent on
 * command execution.
 */
class GithubMessageGenerator {
  constructor() {
    this.fetcher = new GithubFetcher();
    this.defaultEmbed = {
      color: '2672614',
      thumbnail: {
        url: 'https://github.githubassets.com' +
          '/images/modules/logos_page/Octocat.png'
      }
    };
  }
  
  /**
   * Generates an embed message containing the details of each
   * open pull request in the repository
   * @param {String} repo Name of SCE repository
   * @returns {Promise} Embed with pull request details in the field parameter
   */
  generatePullRequestMessage(repo) {
    return new Promise((resolve, reject) => {
      this.fetcher.fetchPullRequests(repo)
        .then(pullRequests => {
          /*
          const embeds = [];
          let pageIndex = 0;
          var i = 0;

          do {
            const prEmbed = new Discord.RichEmbed()
              .setColor('28C7E6')
              .setThumbnail('https://github.githubassets.com' +
              '/images/modules/logos_page/Octocat.png')
              .setTitle(`Pull Requests - ${repo}`)
              .setURL(`https://github.com/SCE-Development/${repo}/pulls`)
              .setDescription('Active pull requests in this repository');
            
              for (i = 10 * pageIndex; i < i + 10; i++) {
              prEmbed.addField(pullRequests[i]);
            }

            pageIndex++;
            embeds.push(prEmbed);
          } while (i + 10 < pullRequests.length)

          const prEmbed = new Discord.RichEmbed()
            .setColor('28C7E6')
            .setThumbnail('https://github.githubassets.com' +
            '/images/modules/logos_page/Octocat.png')
            .setTitle(`Pull Requests - ${repo}`)
            .setURL(`https://github.com/SCE-Development/${repo}/pulls`)
            .setDescription('Active pull requests in this repository');

          for (i = 10 * pageIndex; i < pullRequests.length; i++) {
            prEmbed.addField(pullRequests[i]);
          }

          embeds.push(prEmbed);
          */
          /*  
          this.defaultEmbed.title = `Pull Requests - ${repo}`;
          this.defaultEmbed.url =
            `https://github.com/SCE-Development/${repo}/pulls`;
          this.defaultEmbed.description =
            'Active pull requests in this repository';
          this.defaultEmbed.fields = pullRequests;
          */
          let value = [];
          console.log(pullRequests[0]);
          pullRequests.forEach(({pr}, index) => {
            if (index % 10 == 0) value.push([pr]);
            else value[Math.floor(index/10)].push(pr);
            console.log(pr);
          });
          console.log(value);
          resolve(value);
        })
        .catch(_ => {
          if(_)
            reject(`There is no repository named ${repo}`);
        });
    });
  }
  
  /**
   * Generates a list of embed messages including the details of the
   * top 5 contributors in the repo
   * @param {String} repo Name of SCE repository
   * @returns {Promise} Array<Embeds>
   */
  generateLeaderboardMessage(repo) {
    return new Promise((resolve, reject) => {
      this.fetcher.fetchLeaderboard(repo)
        .then(leaderboard => {
          const embeds = [];
          let rank = 1;
  
          leaderboard.forEach(({user, avatarUrl, commits}) => {
            const embed = new Discord.RichEmbed()
              .setColor('28C7E6')
              .setAuthor(`${rank}. ${user}`, avatarUrl)
              .setDescription(`${commits} Commits`);
            if(rank == 1) {
              embed.description = `:crown: ${embed.description} :crown:`;
            }
            rank++;
            embeds.push(embed);
          });

          resolve(embeds);
        })
        .catch(_ => {
          if(_)
            reject(`There is no repository named ${repo}`);
        });
    });
  }
  
  /**
   * 
   * @param {String} repo Name of SCE repository
   * @param {Integer} numOfCommits Number of commits to be shown
   * Limit of 25. Defined in GithubFetcher.fetchCommits
   * @returns {Promise} Embed with commit details in the field parameter
   */
  generateCommitMessage(repo, numOfCommits=1) {
    return new Promise((resolve, reject) => {
      this.fetcher.fetchCommits(repo)
        .then(commits => {
          this.defaultEmbed.title = `Commit(s) - ${repo}`;
          this.defaultEmbed.url = 
            `https://github.com/SCE-Development/${repo}/commits`;
          this.defaultEmbed.description =
            'Merged commit(s) from this repository';
          this.defaultEmbed.fields = commits.slice(0, numOfCommits);
          resolve({embed: this.defaultEmbed});
        })
        .catch(_ => {
          if(_)
            reject(`There is no repository named ${repo}`);
        });
    });
  }
}

module.exports = { GithubMessageGenerator };
