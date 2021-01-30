const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const CREATE_COMMAND = async args => {
    const makeThread = gql`
      mutation(
        $threadID: String!
        $creatorID: String!
        $guildID: String!
        $channelID: String!
        $topic: String
        $messageID: String
      ) {
        threadCreate(
          threadID: $threadID
          creatorID: $creatorID
          guildID: $guildID
          channelID: $channelID
          topic: $topic
          messageID: $messageID
        ) {
          threadID
          creatorID
          guildID
          channelID
          topic
          threadMessages {
            messageID
          }
        }
      }
    `;
  
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, makeThread, args);
      response.responseData = data.threadCreate;
    } catch (e) {
      response.error = true;
    }
    return response;
  };