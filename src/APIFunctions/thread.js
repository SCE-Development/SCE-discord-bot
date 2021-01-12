const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

/**
 * @typedef {Object} Thread
 *
 * @property {String} threadID The ID of the thread.
 * @property {String} creatorID The user ID of the creator.
 * @property {String} guildID The ID of the guild.
 * @property {String} channelID The ID of the channel.
 * @property {String} [topic] The topic of the thread.
 * @property {String[]} threadMessages The IDs of messages in the thread.
 */

/**
 * @typedef {Object} ThreadManyPayload
 *
 * @property {Thread[]} responseData The threads that matched the query.
 * @property {boolean} error If the query had an error.
 */

/**
 * @typedef {Object} ThreadOnePayload
 *
 * @property {Thread} responseData The thread that matched the query.
 * @property {boolean} error If the query had an error.
 */

/**
 * Queries all threads from the database.
 *
 * @param {Object} args Arguments for the query.
 * @param {String} args.guildID
 *
 * @returns {Promise<ThreadManyPayload>} All threads.
 */
const THREAD_QUERY = async args => {
  const threadQuery = gql`
    query($guildID: String!) {
      threadMany(filter: { guildID: $guildID }) {
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
  await request(`${DISCORD_API_URL}/graphql`, threadQuery, args)
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
 * @param {Object} args Arguments for the query.
 * @param {String} args.threadID
 * @param {String} args.guildID
 * @param {String} args.channelID
 *
 * @returns {Promise<ThreadManyPayload>} All threads with an ID that start with
 * threadID.
 */
const THREAD_ID_QUERY = async args => {
  args = { ...args };
  args.threadID = '^' + args.threadID;
  const threadQuery = gql`
    query($threadID: RegExpAsString!, $channelID: String!, $guildID: String!) {
      threadMany(
        filter: {
          _operators: { threadID: { regex: $threadID } }
          channelID: $channelID
          guildID: $guildID
        }
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
  let response = new ApiResponse();
  await request(`${DISCORD_API_URL}/graphql`, threadQuery, args)
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
 * Creates a new thread in the database.
 *
 * @param  {Object} args Arguments for the mutation.
 * @param  {String} args.threadID
 * @param  {String} args.creatorID
 * @param  {String} args.guildID
 * @param  {String} args.channelID
 * @param  {String?} args.topic
 * @param  {String} args.messageID
 *
 * @returns {Promise<ThreadOnePayload>} The created thread.
 */
const CREATE_THREAD = async args => {
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
  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage, args)
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
 * @param {Object} args Arguments for the mutation.
 * @param {String} args.threadID
 * @param {String} args.guildID
 * @param {String} args.messageID
 *
 * @returns {Promise<ThreadOnePayload>} The thread that the message was added
 * to.
 */
const ADD_THREADMESSAGE = async args => {
  let response = new ApiResponse();

  // Create the thread message
  const makeThreadMessage = gql`
    mutation($threadID: String!, $guildID: String!, $messageID: String!) {
      threadAddMessage(
        threadID: $threadID
        guildID: $guildID
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

  await request(`${DISCORD_API_URL}/graphql`, makeThreadMessage, args)
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
 * @param {Object} args Arguments for the mutation.
 * @param {String} args.threadID
 * @param {String} args.guildID
 *
 * @returns {Promise<ThreadOnePayload>} The deleted thread.
 */
const DELETE_THREAD = async args => {
  let response = new ApiResponse();

  // Delete the thread
  const deleteThread = gql`
    mutation($threadID: String!, $guildID: String!) {
      threadDelete(threadID: $threadID, guildID: $guildID) {
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

  await request(`${DISCORD_API_URL}/graphql`, deleteThread, args)
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
 * @param {Object} args Arguments for the mutation.
 * @param {String} args.threadID
 * @param {String} args.guildID
 * @param {String} args.messageID
 *
 * @returns {Promise<ThreadOnePayload>} The thread where the message was
 * deleted.
 */
const DELETE_THREADMESSAGE = async args => {
  let response = new ApiResponse();

  // Delete the thread message and remove it from the thread
  const deleteThreadMessage = gql`
    mutation($threadID: String!, $guildID: String!, $messageID: String!) {
      threadMessageDelete(
        threadID: $threadID
        guildID: $guildID
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

  await request(`${DISCORD_API_URL}/graphql`, deleteThreadMessage, args)
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
