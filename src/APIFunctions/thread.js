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
 * Queries for threads. ThreadID matches all IDs from start.
 *
 * @param {Object} args Arguments for the query.
 * @param {String?} args.threadID
 * @param {String} args.guildID
 * @param {String?} args.channelID
 *
 * @returns {Promise<ThreadManyPayload>} All threads matching the query.
 */
const THREAD_QUERY = async args => {
  let threadQuery;
  if (args.threadID) {
    args = { ...args };
    args.threadID = '^' + args.threadID;
    threadQuery = gql`
      query($threadID: RegExpAsString!, $channelID: String, $guildID: String!) {
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
  } else {
    threadQuery = gql`
      query($channelID: String, $guildID: String!) {
        threadMany(filter: { channelID: $channelID, guildID: $guildID }) {
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
  }

  const response = new ApiResponse();
  try {
    const data = await request(`${DISCORD_API_URL}/graphql`, threadQuery, args);
    response.responseData = data.threadMany;
  } catch (e) {
    response.error = true;
  }
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
 * @param  {String?} args.messageID
 *
 * @returns {Promise<ThreadOnePayload>} The created thread.
 */
const CREATE_THREAD = async args => {
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
  const addThreadMessage = gql`
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

  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      addThreadMessage,
      args
    );
    response.responseData = data.threadAddMessage;
  } catch (e) {
    response.error = true;
  }
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

  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      deleteThread,
      args
    );
    response.responseData = data.threadDelete;
  } catch (e) {
    response.error = true;
  }
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

  const response = new ApiResponse();
  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      deleteThreadMessage,
      args
    );
    response.responseData = data.threadRemoveMessage;
  } catch (e) {
    response.error = true;
  }
  return response;
};

module.exports = {
  THREAD_QUERY,
  CREATE_THREAD,
  ADD_THREADMESSAGE,
  DELETE_THREAD,
  DELETE_THREADMESSAGE,
};
