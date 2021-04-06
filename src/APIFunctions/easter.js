const { response } = require('express');
const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const QUERY_EGG = async args => {
  const eggQuery = gql`
    query($guildID: String!, $eggID: String, $imageurl: String, $code: String, $description: String, $hint: String) {
      easterEggOne(filter: {
        guildID: $guildID, 
        eggID: $eggID, 
        imageUrl: $imageUrl, 
        code: $code,  
        description: $description, 
        hint: $hint
      }) {
        guildID
        eggID
        imageUrl
        code
        hint
        description
        hint
      }
    }`
  ;
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
const ADD_EGG_TO_BASKET = async args => {
  const eggMutation = gql `
  mutation($guildID: guildID, $userID: String!, $eggID: String!) {
    easterBasketAddEgg(
      guildID: $guildID
      userID: $userID
      eggID: $eggID    
    ) {
      guildID
      userID
      eggs
    }
  }`
  ;
  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      eggMutation,
      args
    );
    response.responseData = data.easterBasketAddEgg;
  } catch (e) {
    response.error = true;
  }

  return response;
};
const CREATE_EGG = async args => {
  const createEggMutation = gql `
  mutation($guildID: String!, $eggID: String!, $imageUrl: String, $code: String, $description: String, $hint: String) {
    easterEggCreate(
      guildID: $guildID, 
      eggID: $eggID, 
      imageUrl: $imageUrl, 
      code: $code,  
      description: $description, 
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
}`;
  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      createEggMutation,
      args
    );
    response.responseData = data.createEggMutation;
  } catch (e) {
    response.error = true;
  }

  return response;
}
const DELETE_EGG = async args => {
  const eggMutation = gql `
  mutation($guildID: String!, $eggID: String!, $imageUrl: String, $code: String, $description: String, $hint: String) {
    easterEggDeleteOne(
      guildID: $guildID, 
      eggID: $eggID, 
      imageUrl: $imageUrl, 
      code: $code,  
      description: $description, 
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
  }`;
  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      eggMutation,
      args
    );
    response.responseData = data.createEggMutation;
  } catch (e) {
    response.error = true;
  }

  return response;
}
module.exports = {
  QUERY_EGG,
  ADD_EGG_TO_BASKET,
  CREATE_EGG,
  DELETE_EGG
};
