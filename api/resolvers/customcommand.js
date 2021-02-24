const {
  CustomCommandTC,
  CustomCommand
} = require('../models/customcommand');
const { UserInputError } = require('apollo-server');
  
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
  CustomCommandCreate: {
    args: { creatorID: 'String!', guildID: 'String!',
      message: 'String!', commandName: 'String'
    },
    type: CustomCommandTC,
    resolve: async (source, args) => {
      CustomCommand.create(args)
        .catch(async () => {
          throw new UserInputError(
            'CustomCommand has failed to create'
          );
        });
      const customCommand = await CustomCommand.findOne(args)
        .catch(async () => {
          throw new UserInputError(
            'CustomCommand creation has returned null'
          );
        });
      return customCommand;
    },
  }
};
  
module.exports = { CCQuery, CCMutation };
  
