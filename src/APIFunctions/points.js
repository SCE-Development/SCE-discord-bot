const { request, gql } = require('graphql-request');
const { url } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const POINTS_QUERY_ONE = async () => {
  const query = gql`
  {
    pointOne {
      username
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

const POINTS_QUERY_MULTIPLE = async () => {
  const query = gql`
  {
    pointMany {
      username
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
    weekPoints,
    monthPoints,
    yearPoints,
    lastTalked
  } = data;
  let response = new ApiResponse();

  // Increment the points
  const incrementPoints = gql`
  mutation {
    totalPoints
    weekPoints
    monthPoints
    yearPoints
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
  POINTS_QUERY_ONE,
  POINTS_QUERY_MULTIPLE,
  ADD_POINTS
};
