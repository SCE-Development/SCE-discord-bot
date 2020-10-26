const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');


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
    points: {
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
