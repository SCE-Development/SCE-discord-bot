const { request, gql } = require('graphql-request');
const { url } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const THREAD_QUERY = async () => {
  const query = gql`
  {
    threadMany {
      threadID
      creatorID
      guildID
      topic
      messages {
        messageID
      }
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

  await request(`${url}/graphql`, makeThreadMessage)
    .then((data) => {
      response.data = data;
    })
    .catch(() => {
      response.data = {};
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

  await request(`${url}/graphql`, makeThreadMessage)
    .then((data) => {
      response.data = data;
    })
    .catch(() => {
      response.data = {};
      response.error = true;
    });
  return response;
};

module.exports = {
  THREAD_QUERY,
  CREATE_THREAD,
  ADD_THREADMESSAGE,
};
