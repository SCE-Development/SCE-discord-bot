const {
    guildConfigTC
  } = require('../models/GuildConfig');
  
  const guildConfigQuery = {
    guildConfigOne: guildConfigTC.mongooseResolvers.findOne(),
    guildConfigMany: guildConfigTC.mongooseResolvers.findMany(),
    guildConfigCount: guildConfigTC.mongooseResolvers.count(),
  };
  
  const guildConfigMutation = {
    guildConfigCreateOne: guildConfigTC.mongooseResolvers.createOne(),
    guildConfigUpdateOne: guildConfigTC.mongooseResolvers.updateOne(),
    guildConfigRemoveOne: guildConfigTC.mongooseResolvers.removeOne(),
    guildConfigRemoveMany: guildConfigTC.mongooseResolvers.removeMany(),
  };
  
  module.exports = { guildConfigQuery, guildConfigMutation };
  