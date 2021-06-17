const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

/**
 * @typedef {Object} Point
 *
 * @property {String} guildID The Discord server's ID.
 * @property {String} userID The user's Discord ID.
 * @property {Number} totalPoints Number of points gained overall.
 * @property {Number} weekPoints Number of points gained since 7 days.
 * @property {Number} monthPoints Number of points gained since 1st of month.
 * @property {Number} yearPoints Number of points gained since Jan 1.
 * @property {Date} lastTalked Date the user's last message was sent.
 */

// Function to query the user's points based on server ID and Discord ID
const POINT_QUERY = async args => {
  const query = gql`
    query ($guildID: String!, $userID: String) {
      pointMany (filter: { guildID: $guildID, userID: $userID }) {
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
    const data = await request(`${DISCORD_API_URL}/graphql`, query, {
      guildID: args.guildID,
      userID: args.userID,
    });
    response.responseData = data.pointMany;
  } catch (e) {
    response.error = true;
  }
  return response;
};

// Function to update user's points based off server ID and Discord ID
// Total/weekly/monthly/yearly points are added and reset here
const UPDATE_POINT = async point => {
  const mutation = gql`
    mutation (
      $guildID: String!
      $userID: String!
      $totalPoints: Int
      $weekPoints: Int
      $monthPoints: Int
      $yearPoints: Int
      $lastTalked: Date
    ) {
      pointUpdateOne (
        guildID: $guildID
        userID: $userID
        totalPoints: $totalPoints
        weekPoints: $weekPoints
        monthPoints: $monthPoints
        yearPoints: $yearPoints
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
  POINT_QUERY,
  UPDATE_POINT,
};
