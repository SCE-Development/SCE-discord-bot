const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

/**
 * @typedef   {Object} Thread
 *
 * @property  {String}    threadID        The ID of the thread.
 * @property  {String}    creatorID       The user ID of the creator.
 * @property  {String}    guildID         The ID of the guild.
 * @property  {String}    channelID       The ID of the channel.
 * @property  {String}    [topic]         The topic of the thread.
 * @property  {String[]}  threadMessages  The IDs of messages in the thread.
 */

/**
 * @typedef   {Object} NewThread
 *
 * @property  {String}    threadID        The ID of the thread.
 * @property  {String}    creatorID       The user ID of the creator.
 * @property  {String}    guildID         The ID of the guild.
 * @property  {String}    channelID       The ID of the channel.
 * @property  {String}    [topic]         The topic of the thread.
 * @property  {String}    messageID       The ID of the message creating the
 *                                        thread.
 */

/**
 * @typedef   {Object} ThreadManyPayload
 *
 * @property  {Thread[]}  responseData  The threads that matched the query.
 * @property  {boolean}   error         If the query had an error.
 */

/**
 * @typedef   {Object} ThreadOnePayload
 *
 * @property  {Thread}  responseData  The thread that matched the query.
 * @property  {boolean} error         If the query had an error.
 */

/**
 * Queries all threads from the database.
 *
 * @returns {ThreadManyPayload} All threads.
 */
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

/**
 * Queries all threads that start with an ID from the database.
 *
 * @param {String} threadID The thread ID to search for, matching from the
 * start.
 *
 * @returns {ThreadManyPayload} All threads with an ID that start with
 * threadID.
 */
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

/**
 * Creates a new thread in the database..
 *
 * @param {NewThread} thread The thread to create.
 *
 * @returns {ThreadOnePayload} The created thread.
 */
const CREATE_THREAD = async thread => {
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
  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage, thread)
    .then(data => {
      response.responseData = data.threadCreate;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

/**
 * Add a message to a thread in the database.
 *
 * @param {String} threadID   The ID of the thread to add the message to.
 * @param {String} messageID  The ID of the message to add.
 *
 * @returns {Thread} The thread that the message was added to.
 */
const ADD_THREADMESSAGE = async (threadID, messageID) => {
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

  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage, {
    threadID,
    messageID,
  })
    .then(data => {
      response.responseData = data.threadAddMessage;
    })
    .catch(() => {
      response.responseData = {};
      response.error = true;
    });
  return response;
};

/**
 * Delete a thread and all its messages from the database.
 *
 * @param {String} threadID The ID of the thread to delete.
 *
 * @returns {Thread} The deleted thread.
 */
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

/**
 * Delete a thread message from the database.
 *
 * @param {String} threadID The ID of the thread containing the message.
 * @param {String} messageID The ID of the message to delete.
 *
 * @returns {Thread} The thread where the message was deleted.
 */
const DELETE_THREADMESSAGE = async (threadID, messageID) => {
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

  await request(`${DISCORD_API_URL}/graphql`, deleteThreadMessage, {
    threadID,
    messageID,
  })
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
