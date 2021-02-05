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
      ) {
        CustomCommandCreate(
          commandName:$commandName,
          creatorID :$creatorID,
          guildID:$guildID
          message:$message,
        ) {
          commandName,
          message,
          creatorID,
          timesUsed,
          createdAt,
          guildID
        }
      }
    `;
  
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, makeCMD, args);
      response.responseData = data.CustomCommandCreate;
    } catch (e) {
      response.error = true;
    }
    return response;
  };

    /**
   * Creates a new command in the database.
   *
   * @param  {Object} args Arguments for the mutation.
   * @param  {String} args.creatorID
   * @param  {String} args.commandName name of
   * command that needs to be deleted
   *
   * @returns {Promise<import('../../api/models/customcommand').
   *  CustomCommand[]>} all customcommands in DB 
   */
  
  const DELETE_COMMAND = async args => {
    const deleteCommand = gql `
    mutation(
      $creatorID: String!
      $commandName: String!
    )
      {
      CustomCommandRemoveOne(
        filter:{
        creatorID:$creatorID
        commandName: $commandName
      })
        {
        record{
          commandName,
          message,
          creatorID,
          timesUsed,
          createdAt,
          guildID
        }
        }
    }
    `
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, deleteCommand, args);
      response.responseData = data.CustomCommandRemoveOne;
    } catch (e) {
      response.error = true;
    }
    return response;
  }
  /**
   * Creates a new command in the database.
   *
   * @param  {Object} args Arguments for the mutation.
   * @param  {String} args.guildID
   *
   * @returns {Promise<import('../../api/models/customcommand').
   *  CustomCommand[]>} all customcommands in DB 
   */
  const QUERY_GUILD = async args => {
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
      response.responseData = data.CustomCommandMany;
    } catch (e) {
      response.error = true;
    }
    return response;
  }

  const QUERY_ALL = async args => {
    const queryAllCommands = gql `
    query
    {
      CustomCommandMany
      {
        commandName,
        message,
        creatorID,
        timesUsed,
        createdAt,
        guildID
      }
    }
    `
    const response = new ApiResponse();
    
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, queryAllCommands, args);
      response.responseData = data.CustomCommandMany;
      // sort it by guild ID
      response.responseData.sort(function(a, b) {
        const LHS = parseInt(a.guildID);
        const RHS = parseInt(b.guildID);
        if( LHS > RHS ) return 1;
        if( LHS < RHS) return -1;
        return 0;
      })
    } catch (e) {
      response.error = true;
    }
    return response;
  }
  
  /**
   * Creates a new command in the database.
   *
   * @param  {Object} args Arguments for the mutation.
   * @param  {String} args.commandName
   *
   * @returns {Promise<import('../../api/models/customcommand').
   *  CustomCommand[]>} all customcommands in DB 
   */
  const QUERY_SINGLE = async args => {
    const queryCommand = gql `
    query($commandName:String!)
    {
      CustomCommandOne(filter:{
      commandName:$commandName
      })
      {
        guildID
        commandName
        creatorID
        message
        timesUsed
        createdAt
      }
    }
    `
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, queryCommand, args);
      response.responseData = data.CustomCommandOne;
    } catch (e) {
      response.error = true;
    }
    return response;
  }
  
  /**
   * Creates a new command in the database.
   *
   * @param  {Object} args Arguments for the mutation.
   * @param  {String} args.commandName
   * @param  {Float} args.timesUsed
   *
   * @returns {Promise<import('../../api/models/customcommand').
   *  CustomCommand[]>} all customcommands in DB 
   */
  const UPDATE_COMMAND = async args => {
    const theUpdoot = gql `
    mutation(
      $commandName: String!
      $timesUsed:Float!
    )
      {
      CustomCommandUpdateOne(
        record:{
          timesUsed: $timesUsed
        }
        filter:{
        commandName: $commandName
      })
        {
        record{
          commandName,
          message,
          creatorID,
          timesUsed,
          createdAt,
          guildID
        }
        }
    }
    `
    const response = new ApiResponse();
    try {
      const data = await request(`${DISCORD_API_URL}/graphql`, theUpdoot, args);
      response.responseData = data.CustomCommandUpdateOne;
    } catch (e) {
      response.error = true;
    }
    return response;
  }

  module.exports = {
    QUERY_ALL,
    QUERY_GUILD,
    QUERY_SINGLE,
    CREATE_COMMAND,
    DELETE_COMMAND,
    UPDATE_COMMAND,
  };
  