const {
  ThreadMessageTC
} = require('../models/threadMessage');

const ThreadMessageQuery = {
  threadMessageById: ThreadMessageTC.mongooseResolvers.findById(),
  threadMessageByIds: ThreadMessageTC.mongooseResolvers.findByIds(),
  threadMessageOne: ThreadMessageTC.mongooseResolvers.findOne(),
  threadMessageMany: ThreadMessageTC.mongooseResolvers.findMany(),
  threadMessageCount: ThreadMessageTC.mongooseResolvers.count(),
  threadMessageConnection: ThreadMessageTC.mongooseResolvers.connection(),
  threadMessagePagination: ThreadMessageTC.mongooseResolvers.pagination(),
};

const ThreadMessageMutation = {
  threadMessageCreateOne: ThreadMessageTC.mongooseResolvers.createOne(),
  threadMessageCreateMany: ThreadMessageTC.mongooseResolvers.createMany(),
  threadMessageUpdateById: ThreadMessageTC.mongooseResolvers.updateById(),
  threadMessageUpdateOne: ThreadMessageTC.mongooseResolvers.updateOne(),
  threadMessageUpdateMany: ThreadMessageTC.mongooseResolvers.updateMany(),
  threadMessageRemoveById: ThreadMessageTC.mongooseResolvers.removeById(),
  threadMessageRemoveOne: ThreadMessageTC.mongooseResolvers.removeOne(),
  threadMessageRemoveMany: ThreadMessageTC.mongooseResolvers.removeMany(),
};

module.exports = { ThreadMessageQuery, ThreadMessageMutation };
