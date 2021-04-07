const { request, gql } = require('graphql-request');
const { DISCORD_API_URL } = require('../../config.json');
const { ApiResponse } = require('./ApiResponses');

const GUILD_CONFIG_QUERY = async args => {
  const guildConfigQuery = gql`
    query($guildID: String) {
      guildConfigMany(filter: { guildID: $guildID }) {
        guildID
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      guildConfigQuery,
      args
    );
    response.responseData = data.guildConfigMany;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const GUILD_CONFIG_SET = async args => {
  const guildConfigMutation = gql`
    mutation($input: GuildConfigInput) {
      guildConfigSet(input: $input) {
        guildID
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      guildConfigMutation,
      { input: args }
    );
    response.responseData = data.guildConfigSet;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const GUILD_CONFIG_DELETE = async args => {
  const guildConfigMutation = gql`
    mutation($guildID: String!) {
      guildConfigRemoveOne(filter: { guildID: $guildID }) {
        record {
          guildID
        }
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      guildConfigMutation,
      args
    );
    response.responseData = data.guildConfigRemoveOne;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const GUILD_CONFIG_QUERY_EASTER = async args => {
  const guildConfigQuery = gql`
    query($guildID: String) {
      guildConfigMany(filter: { guildID: $guildID }) {
        guildID
        easter {
          eggChannels {
            egg {
              guildID
              eggID
              imageUrl
              code
              description
              hint
            }
            channelID
            period
          }
        }
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      guildConfigQuery,
      args
    );
    response.responseData = data.guildConfigMany;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const ADD_EASTER_EGG_CHANNEL = async args => {
  const easterEggChannelMutation = gql`
    mutation(
      $guildID: String!
      $channelID: String!
      $eggID: String!
      $period: Int
    ) {
      guildConfigAddEasterEggChannel(
        guildID: $guildID
        channelID: $channelID
        eggID: $eggID
        period: $period
      ) {
        guildID
        easter {
          eggChannels {
            channelID
            egg {
              guildID
              eggID
              imageUrl
              code
              description
              hint
            }
            period
          }
        }
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      easterEggChannelMutation,
      args
    );
    response.responseData = data.guildConfigAddEasterEggChannel;
  } catch (e) {
    response.error = true;
  }

  return response;
};

const REMOVE_EASTER_EGG_CHANNEL = async args => {
  const easterEggChannelMutation = gql`
    mutation($guildID: String!, $channelID: String!, $eggID: String!) {
      guildConfigEasterEggChannelRemoveOne(
        guildID: $guildID
        channelID: $channelID
        eggID: $eggID
      ) {
        guildID
        easter {
          eggChannels {
            channelID
            egg {
              guildID
              eggID
              imageUrl
              code
              description
              hint
            }
            period
          }
        }
      }
    }
  `;
  const response = new ApiResponse();

  try {
    const data = await request(
      `${DISCORD_API_URL}/graphql`,
      easterEggChannelMutation,
      args
    );
    response.responseData = data.guildConfigRemoveEasterEggChannel;
  } catch (e) {
    response.error = true;
  }

  return response;
};

module.exports = {
  GUILD_CONFIG_QUERY,
  GUILD_CONFIG_SET,
  GUILD_CONFIG_DELETE,
  GUILD_CONFIG_QUERY_EASTER,
  ADD_EASTER_EGG_CHANNEL,
  REMOVE_EASTER_EGG_CHANNEL,
};
