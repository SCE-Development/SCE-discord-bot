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
        url:
          'https://github.githubassets.com' +
          '/images/modules/logos_page/Octocat.png',
      },
    };
  }

  /**
   * Generates a 2-D array of pull requests. Pull requests are grouped together
   * 10 at a time.
   * @param {String} repo Name of SCE repository
   * @returns {Promise} Array of pull requests.
   */
  generatePullRequestMessage(repo) {
    return new Promise((resolve, reject) => {
      this.fetcher
        .fetchPullRequests(repo)
        .then(pullRequests => {
          let value = [];
          pullRequests.forEach((pr, index) => {
            if (index % 10 == 0) value.push([pr]);
            else value[Math.floor(index / 10)].push(pr);
          });
          resolve(value);
        })
        .catch(_ => {
          if (_) reject(`There is no repository named ${repo}`);
        });
    });
  }

  /**
   * Generates a list of embed messages including the details of the
   * top 5 contributors in the repo
   * @param {String} repo Name of SCE repository
   * @param {Number} len The positive integer number of people to include.
   * @returns {Promise} Array<Embeds>
   */
  generateLeaderboardMessage(repo, len = 5) {
    len = Math.max(Math.floor(len), 1);

    return new Promise((resolve, reject) => {
      this.fetcher
        .fetchLeaderboard(repo)
        .then(leaderboard => {
          if (leaderboard.length === 0) {
            resolve(`${repo} has no commits this month. Get coding!`);
            return;
          }
          this.defaultEmbed.title = `Leaderboard - ${repo}`;
          this.defaultEmbed.url =
            `https://github.com/SCE-Development/${repo}/graphs/contributors`;
          this.defaultEmbed.description = `Top ${len} contributors this month`;
          this.defaultEmbed.thumbnail = { url: leaderboard[0].avatarUrl };
          this.defaultEmbed.fields = leaderboard
            .slice(0, len)
            .map(({ user, commits }, index) => {
              if (index === 0) user += ' 👑';
              user = `${index + 1}. ${user}`;
              return { name: user, value: `${commits} commits` };
            });

          resolve({ embed: this.defaultEmbed });
        })
        .catch(_ => {
          if (_) reject(`There is no repository named ${repo}`);
        });
    });
  }

  /**
   * Generates an embed with a list of recent commits to a repo.
   *
   * @param {String} repo Name of SCE repository
   * @param {Integer} numOfCommits Number of commits to be shown
   * Limit of 25. Defined in GithubFetcher.fetchCommits
   * @returns {Promise} Embed with commit details in the field parameter
   */
  generateCommitMessage(repo, numOfCommits = 5) {
    return new Promise((resolve, reject) => {
      this.fetcher
        .fetchCommits(repo)
        .then(commits => {
          if (commits.length === 0) {
            resolve(`${repo} has no commits. Get coding!`);
            return;
          }
          this.defaultEmbed.title = `Commit(s) - ${repo}`;
          this.defaultEmbed.url =
            `https://github.com/SCE-Development/'${repo}/commits`;
          this.defaultEmbed.description =
            'Merged commit(s) from this repository';
          this.defaultEmbed.fields = commits.slice(0, numOfCommits);
          resolve({ embed: this.defaultEmbed });
        })
        .catch(_ => {
          if (_) reject(`There is no repository named ${repo}`);
        });
    });
  }
}

module.exports = { GithubMessageGenerator };
