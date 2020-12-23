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
    args: { guildID: 'String!', userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      let p = Math.floor(Math.random() * (50 - 25) + 25);
      const points = await Point.findOneAndUpdate(
        // If time between messages > 3min, increment
        { guildID: args.guildID, userID: args.userID,
          lastTalked: {$lt: new Date(Date.now() - 1000)} },
        {
          $inc: {
            totalPoints: p,
            weekPoints: p,
            monthPoints: p,
            yearPoints: p
          },
          $set: {
            lastTalked: Date.now()
          }
        },
        { new: true, useFindAndModify: false, upsert: true },
      ).catch((error) => {
        // This error will trigger if time between messages < 3min
        if (error.codeName == 'DuplicateKey') {
          return null;
          // throw new ApolloError('User talked too recently');
        }
      });
      return points;
    }
  },
  // for when a user leaves the server
  pointRemoveOne: PointTC.mongooseResolvers.removeOne(),
  // Resets the points of week/month/year to 0
  weekPointReset: {
    type: PointTC,
    args: { guildID: 'String!', userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const resetted = await Point.findOneAndUpdate(
        { guildID: args.guildID, userID: args.userID },
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
    args: { guildID: 'String!', userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const resetted = await Point.findOneAndUpdate(
        { guildID: args.guildID, userID: args.userID },
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
    args: { guildID: 'String!', userID: 'String!', points: 'Int' },
    resolve: async (source, args) => {
      const resetted = await Point.findOneAndUpdate(
        { guildID: args.guildID, userID: args.userID },
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
