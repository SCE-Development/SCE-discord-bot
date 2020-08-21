const fetch = require('node-fetch');
const { SCE_GITHUB_API_URL } = require('../../config.json');

/**
 * Class that communicates with SCE server's Github API to
 * retrieve data from Github
 */
class GithubFetcher {
  /**
   * Creates GithubFetcher object
   */
  constructor() {}

  /**
   * This function retrieves a list of users that have contributed to a
   * defined repo in the past month
   * @param {*} repo Name of SCE repository
   * @returns {Promise} Contributors
   */
  fetchLeaderboard(repo) {
    return new Promise((resolve, reject) => {
      fetch(`${SCE_GITHUB_API_URL}/api/github/` +
      `getContributorsInPastMonthFromRepo?repository=${repo}`
      )
        .then(data => data.json())
        .then(object => {
          resolve(object.contributors);
        })
        .catch(_ => {
          reject(_);
        });
    });
  }

  /**
   * This function retrieves a list of active pull requests from
   * the defined repo
   * @param {String} repo Name of SCE repository
   * @returns {Promise} Pull Requests LIMIT OF 25
   */
  fetchPullRequests(repo) {
    return new Promise((resolve, reject) => {
      fetch(`${SCE_GITHUB_API_URL}/api/github/` +
        `getPullRequestsFromRepo?repository=${repo}`
      )
        .then(data => data.json())
        .then(object => {
          const pullRequests = object.pullRequests.map(pr => ({
            name: `#${pr.number} ${pr.title}`,
            value: `[view](${pr.pullRequestUrl})`
          }));
          resolve(pullRequests.slice(0, 25));
        })
        .catch(_ => {
          reject(_);
        });
    });
  }

  /**
   * This function retrieves a list of commits from the
   * the defined repo
   * @param {String} repo Name of SCE repository
   * @returns {Promise} Commits
   */
  fetchCommits(repo) {
    return new Promise((resolve, reject) => {
      fetch(`${SCE_GITHUB_API_URL}/api/github/` +
        `getCommitsFromRepo?repository=${repo}`
      )
        .then(data => data.json())
        .then(object => {
          const commits = object.commits.map(commit => ({
            name: `#${commit.user}`,
            value: `[${commit.message}](${commit.commitUrl})`
          }));
          resolve(commits);
        })
        .catch(_ => {
          reject(_);
        });
    });
  }
}

module.exports = { GithubFetcher };
