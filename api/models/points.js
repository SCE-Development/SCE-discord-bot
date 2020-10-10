const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');


const PointSchema = mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
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
      type: Number
    },
    lastTalked: {
      type: String
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
