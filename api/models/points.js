const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

// min = 0 only
const PointSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    userID: {
      type: String,
      required: true,
      unique: true
    },
    totalPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: 0,
    },
    weekPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: 0,
    },
    monthPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: 0,
    },
    yearPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: 0,
    },
    lastTalked: {
      type: Date,
      required: true,
      default: Date.now
    },
  },
  { collection: 'Point' }
);
const Point = mongoose.model('Points', PointSchema);
const PointTC = composeMongoose(Point);

module.exports = {
  Point,
  PointSchema,
  PointTC,
};
