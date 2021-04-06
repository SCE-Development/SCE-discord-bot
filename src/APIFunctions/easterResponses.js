const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const QUERY_BASKET = async args => {
    const queryBasket = gql`
        query(
            $guildID: String!
            $userID:String!
        )
        {
            easterBasketOne(filter:
            {
            guildID:$guildID,
            userID:$userID
            })
            {
            eggs
            }
        }
      `;
    
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, queryBasket, args);
      response.responseData = data.easterBasketOne;
    } catch (e) {
      response.error = true;
    }
    return response;
  };

const QUERY_ALLBASKETS = async args => {
    const queryBasket = gql`
        query($guildID: String!)
        {
            easterBasketMany(filter:{
                guildID: $guildID
            })
                {
                userID
                eggs
            }
        }
      `;
    
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, queryBasket, args);
      response.responseData = data.easterBasketMany;
    } catch (e) {
      response.error = true;
    }
    return response;
  };

const QUERY_ALLEGGS = async args => {
    const queryEggs = gql`
        query($guildID: String!)
        {
            easterEggMany(filter:
            {
                guildID: $guildID
            })
            {
                eggID
                imageUrl
                hint
                description
            }
        }
    `;

    const response = new ApiResponse();
    try {
    const data = await request(`${DISCORD_API_URL}/graphql`, queryEggs, args);
    response.responseData = data.easterEggMany;
    } catch (e) {
    response.error = true;
    }
return response;
};

const CREATE_BASKET = async args => {
    const createBasket = gql`
        mutation(
            $guildID: String!
            $userID:String!
        )
            {
            easterBasketCreateOne(record:{
            guildID: $guildID,
            userID: $userID,
            }
            ){
            record{
                guildID
                userID
                eggs
            }
            }
        }
      `;
    
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, createBasket, args);
      response.responseData = data.easterBasketCreateOne;
    } catch (e) {
      response.error = true;
    }
    return response;
  };

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
    QUERY_BASKET,
    QUERY_ALLBASKETS,
    QUERY_ALLEGGS,
    CREATE_BASKET,
    ADD_EGG,
    QUERY_EGG,
  }