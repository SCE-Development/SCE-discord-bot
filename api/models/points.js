const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');
let p = Math.floor(Math.random() * (50 - 25) + 25);

const PointSchema = mongoose.Schema(
  {
    guildID: {
      type: String,
      required: true,
      default: '717588052964409366',
    },
    userID: {
      type: String,
      required: true,
    },
    totalPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: p,
    },
    weekPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: p,
    },
    monthPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: p,
    },
    yearPoints: {
      type: Number,
      min: [0, 'Cannot be negative'],
      required: true,
      default: p,
    },
    lastTalked: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  { collection: 'Point' }
);
PointSchema.index({ guildID: 1, userID: 1 }, { unique: true });
const Point = mongoose.model('Points', PointSchema);
const PointTC = composeMongoose(Point);

module.exports = {
  Point,
  PointSchema,
  PointTC,
};
