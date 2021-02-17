// const { ApolloError } = require('apollo-server');
// const { Aggregate } = require('mongoose');
const {
  PointTC, Point
} = require('../models/points');

const PointQuery = {
  pointOne: PointTC.mongooseResolvers.findOne(),
  pointMany: PointTC.mongooseResolvers.findMany(),
  pointCount: PointTC.mongooseResolvers.count(),
  pointPagination: PointTC.mongooseResolvers.pagination()
};

const PointMutation = {
  pointUpdateOne: {
    type: PointTC,
    args: {
      guildID: 'String!', userID: 'String!', points: 'Int',
      weekPoints: 'Int', monthPoints: 'Int', yearPoints: 'Int',
      totalPoints: 'Int', lastTalked: 'Date'
    },
    resolve: async (source, args) => {
      const points = await Point.findOneAndUpdate(
        { guildID: args.guildID, userID: args.userID },
        {
          $set: {
            weekPoints: args.weekPoints,
            monthPoints: args.monthPoints,
            yearPoints: args.yearPoints,
            totalPoints: args.totalPoints,
            lastTalked: args.lastTalked
          }
        },
        { new: true, useFindAndModify: false, upsert: true },
      );
      return points;
    }
  },
  // for when a user leaves the server
  pointRemoveOne: PointTC.mongooseResolvers.removeOne(),
};

module.exports = { PointQuery, PointMutation };
