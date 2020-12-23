const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const POINTS_QUERY = async (message) => {
  const author = message.member;
  const query = gql`
  query {
    pointOne (filter: {userID: "${author.id}"}) {
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
  await request(`${DISCORD_API_URL}/graphql`, query)
    .then((data) => {
      response.responseData = data.pointOne;
    })
    .catch(() => {
      response.error = true;
    });
  return response;
};

const ADD_POINTS = async (message) => {
  const author = message.member;
  const mutation = gql`
  mutation {
    pointUpdateOne (userID: "${author.id}") {
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
  await request(`${DISCORD_API_URL}/graphql`, mutation)
    .then((data) => {
      response.responseData = data;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

// Reset mutation

// Delete mutation
module.exports = {
  POINTS_QUERY,
  ADD_POINTS
};
