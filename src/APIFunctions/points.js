const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

/**
 * @typedef {Object} Points
 *
 * @property {String} guildID The Discord server's ID.
 * @property {String} userID The user's Discord ID.
 * @property {Int} totalPoints Number of points gained overall.
 * @property {Int} weekPoints Number of points gained since 7 days.
 * @property {Int} monthPoints Number of points gained since 1st of month.
 * @property {Int} yearPoints Number of points gained since Jan 1.
 * @property {Date} lastTalked Date the user's last message was sent.
 */

const POINTS_COOLDOWN_TIME = 1000; // Cooldown time in ms
const POINTS_QUERY = async (args) => {
  const query = gql`
  query ($guildID: String!, $userID: String) {
    pointMany (filter: {guildID: $guildID, userID: $userID}) {
      guildID
      userID
      totalPoints
      weekPoints
      monthPoints
      yearPoints
      lastTalked
    }
  }
    `;
  let response = new ApiResponse();
  await request(`${DISCORD_API_URL}/graphql`, query, {
    guildID: args.guildID,
    userID: args.userID
  })
    .then((data) => {
      response.responseData = data.pointMany;
    })
    .catch(() => {
      response.error = true;
    });
  return response;
};

const UPDATE_POINTS = async (point) => {
  const mutation = gql`
  mutation ($guildID: String!, $userID: String!, $totalPoints: Int,
    $weekPoints: Int, $monthPoints: Int, $yearPoints: Int, $lastTalked: Date) {
    pointUpdateOne (
      guildID: $guildID,
      userID: $userID,
      totalPoints: $totalPoints,
      weekPoints: $weekPoints,
      monthPoints: $monthPoints,
      yearPoints: $yearPoints,
      lastTalked: $lastTalked
    ) {
      guildID
      userID
      totalPoints
      weekPoints
      monthPoints
      yearPoints
      lastTalked
    }
  }
  `;
  let response = new ApiResponse();
  try {
    const data = await request(`${DISCORD_API_URL}/graphql`, mutation, point);
    response.responseData = data.pointUpdateOne;
  } catch (e) {
    response.error = true;
  }
  return response;
};

module.exports = {
  POINTS_COOLDOWN_TIME,
  POINTS_QUERY,
  UPDATE_POINTS
};
