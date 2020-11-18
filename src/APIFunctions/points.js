const { request, gql } = require('graphql-request');
const { url } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const POINTS_QUERY = async () => {
  const query = gql`
  {
    pointMany {
      username
      userID
      totalPoints
      lastTalked
    }
  }
  `;
  let response = new ApiResponse();
  await request(`${url}/graphql`, query)
    .then((data) => {
      response.responseData = data;
      response.error = false;
    })
    .catch(() => {
      response.error = true;
    });
  return response;
};

const ADD_POINTS = async (data) => {
  const {
    username,
    userID,
    totalPoints,
    lastTalked
  } = data;
  let response = new ApiResponse();

  // Increment the points
  const incrementPoints = gql`
  mutation {
    
  }
  `
  await request(`${url}/graphql`, incrementPoints)
    .then((data) => {
      response.data = data;
    })
    .catch(() => {
      response.data = {};
      response.error = true;
    });
  return response;
}

module.exports = {
  POINTS_QUERY,
  ADD_POINTS
};
