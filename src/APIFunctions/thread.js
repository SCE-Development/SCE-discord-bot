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
        channelID
        topic
        threadMessages {
          messageID
        }
      }
    }
  `;

  let response = new ApiResponse();
  await request(`${DISCORD_API_URL}/graphql`, threadQuery)
    .then(data => {
      response.responseData = data.threadMany;
      response.error = false;
    })
    .catch(() => {
      response.error = true;
    });
  return response;
};

const THREAD_ID_QUERY = async threadID => {
  const threadQuery = gql`
    query($threadID: RegExpAsString!) {
      threadMany(filter: { _operators: { threadID: { regex: $threadID } } }) {
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
  let response = new ApiResponse();
  await request(`${DISCORD_API_URL}/graphql`, threadQuery, {
    threadID: '^' + threadID,
  })
    .then(data => {
      response.responseData = data.threadMany;
      response.error = false;
    })
    .catch(() => {
      response.error = true;
    });
  return response;
};

const CREATE_THREAD = async data => {
  let response = new ApiResponse();

  // Create the thread message
  const makeThreadMessage = gql`
    mutation(
      $threadID: String!
      $creatorID: String!
      $guildID: String!
      $channelID: String!
      $topic: String
      $messageID: String!
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
  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage, data)
    .then(data => {
      response.responseData = data.threadCreate;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

const ADD_THREADMESSAGE = async data => {
  let response = new ApiResponse();

  // Create the thread message
  const makeThreadMessage = gql`
    mutation($threadID: String!, $messageID: String!) {
      threadAddMessage(threadID: $threadID, messageID: $messageID) {
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

  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage, data)
    .then(data => {
      response.responseData = data.threadAddMessage;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

const DELETE_THREAD = async threadID => {
  let response = new ApiResponse();

  // Delete the thread
  const deleteThread = gql`
    mutation($threadID: String!) {
      threadDelete(threadID: $threadID) {
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

  await request(`${DISCORD_API_URL}/graphql`, deleteThread, { threadID })
    .then(data => {
      response.responseData = data.threadDelete;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

const DELETE_THREADMESSAGE = async data => {
  let response = new ApiResponse();

  // Delete the thread message and remove it from the thread
  const deleteThreadMessage = gql`
    mutation($threadID: String!, $messageID: String!) {
      threadMessageDelete(threadID: $threadID, messageID: $messageID) {
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

  await request(`${DISCORD_API_URL}/graphql`, deleteThreadMessage, data)
    .then(data => {
      response.responseData = data.threadRemoveMessage;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

module.exports = {
  THREAD_QUERY,
  THREAD_ID_QUERY,
  CREATE_THREAD,
  ADD_THREADMESSAGE,
  DELETE_THREAD,
  DELETE_THREADMESSAGE,
};
