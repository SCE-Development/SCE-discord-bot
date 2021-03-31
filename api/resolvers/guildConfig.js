const { SystemError, UserInputError } = require('apollo-server');
const { GuildConfigTC, GuildConfig } = require('../models/guildConfig');

const GuildConfigQuery = {
  guildConfigOne: GuildConfigTC.mongooseResolvers.findOne(),
  guildConfigMany: GuildConfigTC.mongooseResolvers.findMany(),
  guildConfigCount: GuildConfigTC.mongooseResolvers.count(),
};

const GuildConfigMutation = {
  guildConfigCreateOne: GuildConfigTC.mongooseResolvers.createOne(),
  guildConfigUpdateOne: GuildConfigTC.mongooseResolvers.updateOne(),
  guildConfigRemoveOne: GuildConfigTC.mongooseResolvers.removeOne(),
  guildConfigRemoveMany: GuildConfigTC.mongooseResolvers.removeMany(),
};

module.exports = { GuildConfigQuery, GuildConfigMutation };
