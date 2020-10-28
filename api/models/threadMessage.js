const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');


const ThreadMessageSchema = mongoose.Schema(
  {
    messageID: {
      // ID of discord message
      type: String,
      required: true
    },
    position: {
      // Position of message in thread
      type: Number,
      required: true
    },
  },
  { collection: 'threadMessages' }
);

const ThreadMessage = mongoose.model('ThreadMessage', ThreadMessageSchema);
const ThreadMessageTC = composeMongoose(ThreadMessage);

module.exports = {
  ThreadMessage,
  ThreadMessageSchema,
  ThreadMessageTC
};
