const {
  PointTC
} = require('../models/points');

const PointQuery = {
  pointOne: PointTC.mongooseResolvers.findOne(),
  pointMany: PointTC.mongooseResolvers.findMany(),
  pointCount: PointTC.mongooseResolvers.count(),
  pointConnection: PointTC.mongooseResolvers.connection(),
  pointPagination: PointTC.mongooseResolvers.pagination(), // does this...
  // allow to check points with Discord react/page feature like clihelp?
};

// define these I think
const PointMutation = {
  pointUpdateOne: {
    type: PointTC,
    // what triggers this goes here. so a message?
    args: {}
  },
  // resets the point of week/month/year to 0
  pointReset: {
    type: PointTC,
    // what triggers this goes here. so a message?
    args: {}
  }
};

module.exports = { PointQuery, PointMutation };
