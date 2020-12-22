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
<<<<<<< HEAD
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

const THREAD_ID_QUERY = async (threadID) => {
  const threadQuery = gql`
    {
      threadMany(filter: {
        _operators: {threadID: {regex: "^${threadID}" } }
      }) {
        threadID
        creatorID
        guildID
        topic
        threadMessages {
          messageID
        }
=======
>>>>>>> cb04f3f44b0c7c1211ca1d9d7ec048415f908b68
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
  const { threadID, creatorID, guildID, topic, messageID } = data;
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
  const { threadID, messageID } = data;
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

<<<<<<< HEAD
const DELETE_THREAD = async (threadID) => {
=======
const DELETE_THREAD = async (data) => {
  const { threadID } = data;
>>>>>>> cb04f3f44b0c7c1211ca1d9d7ec048415f908b68
  let response = new ApiResponse();

  // Delete the thread
  const deleteThread = gql`
  mutation {
    threadDelete(
      threadID:"${threadID}",
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

  await request(`${DISCORD_API_URL}/graphql`, deleteThread)
    .then((data) => {
      response.responseData = data.threadDelete;
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
};
