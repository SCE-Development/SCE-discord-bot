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
      let p = Math.floor(Math.random() * (50 - 25) + 25);
      const points = await Point.findOneAndUpdate(
        // check if user has points. if not, add them.
        { userID: args.userID },
        {
          $inc: {
            totalPoints: p,
            weekPoints: p,
            monthPoints: p,
            yearPoints: p
          }
        },
        { new: true, useFindAndModify: false, upsert: true },
      );
      return points;
    }
  },
  // for when a user leaves the server
  pointRemoveOne: PointTC.mongooseResolvers.removeOne(),
  // resets the point of week/month/year to 0
  weekPointReset: {
    type: PointTC,
    args: { userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const resetted = await Point.findOneAndUpdate(
        { userID: args.userID },
        {
          $set: {
            weekPoints: 0
          }
        },
        { new: true, useFindAndModify: false },
      );
      return resetted;
    }
  },
  monthPointReset: {
    type: PointTC,
    args: { userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const resetted = await Point.findOneAndUpdate(
        { userID: args.userID },
        {
          $set: {
            monthPoints: 0
          }
        },
        { new: true, useFindAndModify: false },
      );
      return resetted;
    }
  },
  yearPointReset: {
    type: PointTC,
    args: { userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const resetted = await Point.findOneAndUpdate(
        { userID: args.userID },
        {
          $set: {
            yearPoints: 0
          }
        },
        { new: true, useFindAndModify: false },
      );
      return resetted;
    }
  }
};

module.exports = { PointQuery, PointMutation };
