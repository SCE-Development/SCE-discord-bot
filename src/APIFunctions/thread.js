const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const THREAD_QUERY = async () => {
  const threadQuery = gql`
  {
    threadMany {
      threadID
      creatorID
      guildID
      topic
      threadMessages {
        messageID
      }
    }
  }
  `;

  let response = new ApiResponse();
  await request(`${DISCORD_API_URL}/graphql`, threadQuery)
    .then((data) => {
      response.responseData = data.threadMany;
      response.error = false;
    })
    .catch(() => {
      response.error = true;
    });
  return response;
};

const CREATE_THREAD = async (data) => {
  const {
    threadID,
    creatorID,
    guildID,
    topic,
    messageID
  } = data;
  let response = new ApiResponse();

  // Create the thread message
  const makeThreadMessage = gql`
  mutation {
    threadCreate(
      threadID:"${threadID}",
      creatorID:"${creatorID}",
      guildID:"${guildID}",
      topic:"${topic}",
      messageID:"${messageID}"
    ) {
      threadID
      creatorID
      guildID
      topic
      threadMessages {
        messageID
      }
    }
  }
  `;

  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage)
    .then((data) => {
      response.responseData = data.threadCreate;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

const ADD_THREADMESSAGE = async (data) => {
  const {
    threadID,
    messageID
  } = data;
  let response = new ApiResponse();

  // Create the thread message
  const makeThreadMessage = gql`
  mutation { 
    threadAddMessage(
      threadID:"${threadID}",
      messageID:"${messageID}"
    ) {
      threadID
      creatorID
      guildID
      topic
      threadMessages {
        messageID
      }
    }
  }
  `;

  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage)
    .then((data) => {
      response.responseData = data.threadAddMessage;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

module.exports = {
  THREAD_QUERY,
  CREATE_THREAD,
  ADD_THREADMESSAGE,
};
