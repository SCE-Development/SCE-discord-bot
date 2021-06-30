const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const PointSchema = mongoose.Schema(
  {
    guildID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    totalPoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    weekPoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    monthPoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    yearPoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    lastTalked: {
      type: Date,
    },
  },
  { collection: 'Points' }
);

const Point = mongoose.model('Point', PointSchema);
const PointTC = composeMongoose(Point);

module.exports = {
  Point,
  PointSchema,
  PointTC,
};
