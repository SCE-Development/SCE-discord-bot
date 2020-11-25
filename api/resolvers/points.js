const {
  PointSchema, PointTC, Point
} = require('../models/points');

const PointQuery = {
  pointOne: PointTC.mongooseResolvers.findOne(),
  pointMany: PointTC.mongooseResolvers.findMany(),
  pointCount: PointTC.mongooseResolvers.count(),
  pointPagination: PointTC.mongooseResolvers.pagination()
};

// define these I think
const PointMutation = {
  pointUpdateOne: {
    type: PointTC,
    args: { userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const points = await Point.findOneAndUpdate(
        // check if user has points. if not, add them.
        { userID: args.userID },
        {
          $inc: {
            totalPoints: 1,
            weekPoints: 1,
            monthPoints: 1,
            yearPoints: 1
          }
        },
        { new: true, useFindAndModify: false, upsert: true },

      );
      console.log(points);
      return points;
    }
  },
  // for when a user leaves the server
  pointRemoveOne: PointTC.mongooseResolvers.removeOne(),
  // resets the point of week/month/year to 0
  pointReset: {
    type: PointTC,
    args: {}
  }
};

module.exports = { PointQuery, PointMutation };
