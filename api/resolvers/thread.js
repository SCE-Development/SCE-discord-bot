const {
  ThreadTC
} = require('../models/thread');

const ThreadQuery = {
  threadById: ThreadTC.mongooseResolvers.findById(),
  threadByIds: ThreadTC.mongooseResolvers.findByIds(),
  threadOne: ThreadTC.mongooseResolvers.findOne(),
  threadMany: ThreadTC.mongooseResolvers.findMany(),
  threadCount: ThreadTC.mongooseResolvers.count(),
  threadConnection: ThreadTC.mongooseResolvers.connection(),
  threadPagination: ThreadTC.mongooseResolvers.pagination(),
};

const ThreadMutation = {
  threadCreateOne: ThreadTC.mongooseResolvers.createOne(),
  threadCreateMany: ThreadTC.mongooseResolvers.createMany(),
  threadUpdateById: ThreadTC.mongooseResolvers.updateById(),
  threadUpdateOne: ThreadTC.mongooseResolvers.updateOne(),
  threadUpdateMany: ThreadTC.mongooseResolvers.updateMany(),
  threadRemoveById: ThreadTC.mongooseResolvers.removeById(),
  threadRemoveOne: ThreadTC.mongooseResolvers.removeOne(),
  threadRemoveMany: ThreadTC.mongooseResolvers.removeMany(),
};

module.exports = { ThreadQuery, ThreadMutation };
