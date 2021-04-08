const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const EASTER_EGG_QUERY = async args => {
  const eggQuery = gql`
    query($guildID: String!, $eggID: String, $code: String) {
      easterEggMany(filter: { guildID: $guildID, eggID: $eggID, code: $code }) {
        guildID
        eggID
        imageUrl
        code
        description
        hint
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(`${DISCORD_API_URL}/graphql`, eggQuery, args);
    response.responseData = data.easterEggMany;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const EASTER_BASKET_QUERY = async args => {
  const basketQuery = gql`
    query($guildID: String!, $userID: String) {
      easterBasketMany(filter: { guildID: $guildID, userID: $userID }) {
        guildID
        userID
        eggs {
          guildID
          eggID
          imageUrl
          code
          description
          hint
        }
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(`${DISCORD_API_URL}/graphql`, basketQuery, args);
    response.responseData = data.easterBasketMany;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const EASTER_BASKET_ADD_EGG = async args => {
  const eggMutation = gql`
    mutation($guildID: String!, $userID: String!, $eggID: String!) {
      easterBasketAddEgg(guildID: $guildID, userID: $userID, eggID: $eggID) {
        guildID
        userID
        eggs {
          guildID
          eggID
          imageUrl
          code
          description
          hint
        }
      }
    }
  `;

  const response = new ApiResponse();
  try {
    const data = await request(`${DISCORD_API_URL}/graphql`, eggMutation, args);
    response.responseData = data.easterBasketAddEgg;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const EASTER_EGG_CREATE = async args => {
  const createEggMutation = gql`
    mutation(
      $guildID: String!
      $eggID: String!
      $imageUrl: String
      $code: String
      $description: String
      $hint: String
    ) {
      easterEggCreate(
        guildID: $guildID
        eggID: $eggID
        imageUrl: $imageUrl
        code: $code
        description: $description
        hint: $hint
      ) {
        guildID
        eggID
        imageUrl
        code
        hint
        description
        hint
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      createEggMutation,
      args
    );
    response.responseData = data.createEggCreate;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const EASTER_EGG_DELETE = async args => {
  const eggMutation = gql`
    mutation($guildID: String!, $eggID: String) {
      easterEggDelete(guildID: $guildID, eggID: $eggID) {
        guildID
        eggID
        imageUrl
        code
        hint
        description
        hint
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(`${DISCORD_API_URL}/graphql`, eggMutation, args);
    response.responseData = data.easterEggDelete;
  } catch (e) {
    response.error = true;
  }

  return response;
};

module.exports = {
  EASTER_EGG_QUERY,
  EASTER_BASKET_QUERY,
  EASTER_BASKET_ADD_EGG,
  EASTER_EGG_CREATE,
  EASTER_EGG_DELETE,
};
