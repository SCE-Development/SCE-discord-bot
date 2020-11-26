const { request, gql } = require('graphql-request');
const { url } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const POINTS_QUERY_ONE = async (message) => {
  const query = gql`
  query ($userID: String!) {
    pointOne (filter: {userID: $userID}){
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
  const author = message.member;
  await request(`${url}/graphql`, query, {'userID': message.author.id})
    .then((data) => {
      response.responseData = data;
      response.error = false;
      console.log(data);
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

const ADD_POINTS = async (message) => {
  const author = message.member;
  const mutation = gql`
  {
    mutation {
      pointUpdateOne (userID: message.author.id) {
        userID
        totalPoints
        weekPoints
        monthPoints
        yearPoints
        lastTalked
      }
    }
  }
  `
  let response = new ApiResponse();
  await request(`${url}/graphql`, mutation, {'userID': message.author.id})
    .then((data) => {
      response.data = data;
      console.log(data);
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
