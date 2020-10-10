const {
  PointTC
} = require('../models/points');

const PointQuery = {
  pointById: PointTC.mongooseResolvers.findById(),
  pointByIds: PointTC.mongooseResolvers.findByIds(),
  pointOne: PointTC.mongooseResolvers.findOne(),
  pointMany: PointTC.mongooseResolvers.findMany(),
  pointCount: PointTC.mongooseResolvers.count(),
  pointConnection: PointTC.mongooseResolvers.connection(),
  pointPagination: PointTC.mongooseResolvers.pagination(),
};

const PointMutation = {
  pointCreateOne: PointTC.mongooseResolvers.createOne(),
  pointCreateMany: PointTC.mongooseResolvers.createMany(),
  pointUpdateById: PointTC.mongooseResolvers.updateById(),
  pointUpdateOne: PointTC.mongooseResolvers.updateOne(),
  pointUpdateMany: PointTC.mongooseResolvers.updateMany(),
  pointRemoveById: PointTC.mongooseResolvers.removeById(),
  pointRemoveOne: PointTC.mongooseResolvers.removeOne(),
  pointRemoveMany: PointTC.mongooseResolvers.removeMany(),
};

module.exports = { PointQuery, PointMutation };
