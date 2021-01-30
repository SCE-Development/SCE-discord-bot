const {
    CustomCommandTC,
    CustomCommand
  } = require('../models/customcommand');
const { SystemError, UserInputError } = require('apollo-server');
  
  const CCQuery = {
    CustomCommandOne: CustomCommandTC.mongooseResolvers.findOne(),
    CustomCommandMany: CustomCommandTC.mongooseResolvers.findMany(),
    CustomCommandCount: CustomCommandTC.mongooseResolvers.count(),
  };
  
  const CCMutation = {
    CustomCommandCreateOne: CustomCommandTC.mongooseResolvers.createOne(),
    CustomCommandUpdateOne: CustomCommandTC.mongooseResolvers.updateOne(),
    CustomCommandRemoveOne: CustomCommandTC.mongooseResolvers.removeOne(),
    CustomCommandRemoveMany: CustomCommandTC.mongooseResolvers.removeMany(),
  };
  
  module.exports = { CCQuery, CCMutation };
  