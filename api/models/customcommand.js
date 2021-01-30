const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');


const CCSchema = mongoose.Schema(
  {
    commandName: {
      type: String,
      required: true,
      unique: true
    },
    userID: {
      type: String,
      required: true,
    },
    guildID: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    timesUsed: {
      type: Number,
      required: true,
      default: 0
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date()
    }
  },
  { collection: 'CustomCommand' }
);

const CustomCommand = mongoose.model('CustomCommand', CCSchema);
const CustomCommandTC = composeMongoose(CustomCommand);

module.exports = {
  CustomCommand,
  CCSchema,
  CustomCommandTC,
};
