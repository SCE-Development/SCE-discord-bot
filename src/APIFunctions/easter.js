const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const QUERY_EGG = async args => {
  const eggQuery = gql`
    query($code: String) {
      easterEggOne(filter: {code: $code}) {
        eggID
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      eggQuery,
      args,
    );
    response.responseData = data.easterEggOne;
  } catch (e) {
    response.error = true;
  }

  return response;
};
const ADD_EGG = async args => {
  const eggMutation = gql`
  mutation($userID: String!, $eggID: String!) {
    easterBasketAddEgg(
      userID: $userID
      eggID: $eggID	
    ) {
      guildID
      userID
      eggs
    }
  }
  `;
  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      eggMutation,
      args
    );
    response.responseData = data.easterEggOne;
  } catch (e) {
    response.error = true;
  }

  return response;
};
module.exports = {
  QUERY_EGG,
  ADD_EGG,
};
