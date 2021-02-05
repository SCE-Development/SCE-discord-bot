const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

/**
 * @typedef {Object} CustomCommand
 * object stored in the database
 * 
 * @property {String} commandName
 * @property {String} creatorID
 * @property {String} guildID
 * @property {String} message 
 * the response message when command is called
 * @property {Number} timesUsed
 * @property {Date} createdAt
 */
const CCSchema = mongoose.Schema(
  {
    guildID: {
      type: String,
      required: true,
    },
    commandName: {
      type: String,
      required: true,
      unique: true
    },
    creatorID: {
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
