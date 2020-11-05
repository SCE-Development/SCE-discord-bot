const {
  ThreadMessageTC
} = require('../models/threadMessage');

const ThreadMessageQuery = {
  threadMessageOne: ThreadMessageTC.mongooseResolvers.findOne(),
  threadMessageMany: ThreadMessageTC.mongooseResolvers.findMany(),
  threadMessageCount: ThreadMessageTC.mongooseResolvers.count(),
};

const ThreadMessageMutation = {
  threadMessageCreateOne: ThreadMessageTC.mongooseResolvers.createOne(),
  threadMessageUpdateOne: ThreadMessageTC.mongooseResolvers.updateOne(),
  threadMessageRemoveOne: ThreadMessageTC.mongooseResolvers.removeOne(),
  threadMessageRemoveMany: ThreadMessageTC.mongooseResolvers.removeMany(),
};

module.exports = { ThreadMessageQuery, ThreadMessageMutation };
