const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const POINTS_QUERY = async (message) => {
  const author = message.member;
  const guild = message.guild;
  const query = gql`
  query {
    pointOne (filter: {guildID: "${guild.id}", userID: "${author.id}"}) {
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

const ADD_POINTS = async (point) => {
  const mutation = gql`
  mutation {
    pointUpdateOne (guildID: "${point.guildID}", userID: "${point.userID}",
    totalPoints: "${point.totalPoints}", weekPoints: "${point.weekPoints}",
    monthPoints: "${point.monthPoints}", yearPoints: "${point.yearPoints}",
    lastTalked: "${point.lastTalked}") {
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
    const data = await request(`${DISCORD_API_URL}/graphql`, mutation, point)
    response.responseData = data.pointUpdateOne;
  } catch (e) {
    response.error = true;
  }
  return response;
};

// Reset mutation

// Delete mutation
module.exports = {
  POINTS_QUERY,
  ADD_POINTS
};
