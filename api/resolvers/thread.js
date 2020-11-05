const {
  ThreadTC,
  Thread,
} = require('../models/thread');
const { ThreadMessage } = require('../models/threadMessage');

const ThreadQuery = {
  threadOne: ThreadTC.mongooseResolvers.findOne(),
  threadMany: ThreadTC.mongooseResolvers.findMany(),
  threadCount: ThreadTC.mongooseResolvers.count(),
};

const ThreadMutation = {
  threadCreateOne: ThreadTC.mongooseResolvers.createOne(),
  threadUpdateOne: ThreadTC.mongooseResolvers.updateOne(),
  threadRemoveOne: ThreadTC.mongooseResolvers.removeOne(),
  threadRemoveMany: ThreadTC.mongooseResolvers.removeMany(),
  threadAddMessage: {
    type: ThreadTC,
    args: { threadID: 'String!', messageID: 'String!' },
    resolve: async (source, args) => {
      const message = await ThreadMessage.create({
        messageID: args.messageID
      });
      // error
      if (!message) return null;

      const thread = await Thread.findOneAndUpdate(
        { threadID: args.threadID },
        { $addToSet: { threadMessages: message } },
        { new: true }
      );
      return thread;
    }
  },
  threadCreate: {
    type: ThreadTC,
    args: {
      threadID: 'String!',
      creatorID: 'String!',
      guildID: 'String!',
      topic: 'String',
      messageID: 'String!',
    },
    resolve: async (source, args) => {
      const {
        threadID,
        creatorID,
        guildID,
        topic,
        messageID,
      } = args;
      const message = await ThreadMessage.create({
        messageID
      });
      // error
      if (!message) return null;

      const thread = await Thread.create({
        threadID,
        creatorID,
        guildID,
        topic,
        threadMessages: [message]
      });
      if (!thread) return null;
      return thread;
    }
  }
};

module.exports = { ThreadQuery, ThreadMutation };
