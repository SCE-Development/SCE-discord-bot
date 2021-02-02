const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

/**
 * Creates a new command in the database.
 *
 * @param  {Object} args Arguments for the mutation.
 * @param  {String} args.commandName
 * @param  {String} args.creatorID
 * @param  {String} args.guildID
 * @param  {String} args.message
 * @param  {Float} args.timesUsed
 * @param  {Date} args.createdAt
 *
 * @returns {Promise<[commandName, messsage]>} The created thread.
 */
const CREATE_COMMAND = async args => {
    const makeCMD = gql`
      mutation(
        $commandName: String!
        $creatorID: String!
        $guildID: String!
        $message: String!
        $timesUsed: Float!
        $createdAt: Date!
      ) {
        CustomCommandCreateOne(
          record:{
          commandName:$commandName,
          creatorID :$creatorID,
          guildID:$guildID
          message:$message,
          timesUsed:$timesUsed,
          createdAt: $createdAt
          }
        ) {
          record{
          commandName,
            message
          }
        }
      }
    `;
  
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, makeCMD, args);
      response.responseData = data.threadCreate;
    } catch (e) {
      response.error = true;
    }
    return response;
  };

  /**
   * Creates a new command in the database.
   *
   * @param  {Object} args Arguments for the mutation.
   * @param  {String} args.guildID
   *
   * @returns {Promise<import('../../api/models/customcommand').
   *  CustomCommand[]>} all customcommands in DB 
   */
  const QUERY_ALL = async args => {
    const queryAllCommands = gql `
    query(
      $guildID: String!
    )
    {
      CustomCommandMany(filter:{
        guildID:$guildID
      })
      {
        commandName,
        message,
        creatorID,
        timesUsed,
        createdAt
      }
    }
    `
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, queryAllCommands, args);
      response.responseData = data.threadCreate;
    } catch (e) {
      response.error = true;
    }
    return response;
  }