const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');
const { ThreadMessageTC } = require('./threadMessage');


const ThreadSchema = mongoose.Schema(
  {
    threadID: {
      // Automatically assign using timestamp
      type: String,
      required: true,
      unique: true
    },
    creatorID: {
      type: String,
      required: true
    },
    guildID: {
      type: String,
      required: true
    },
    topic: {
      type: String,
    },
    threadMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ThreadMessage'
      }
    ]
  },
  { collection: 'threads' }
);

const Thread = mongoose.model('Thread', ThreadSchema);
const ThreadTC = composeMongoose(Thread);

// Add relations
ThreadTC.addRelation(
  'threadMessages',
  {
    resolver: () => ThreadMessageTC.mongooseResolvers.dataLoaderMany(),
    prepareArgs: {
      _ids: (source) => source.threadMessages || []
    },
    projection: { threadMessages: true }
  }
);

module.exports = {
  Thread,
  ThreadSchema,
  ThreadTC,
};
