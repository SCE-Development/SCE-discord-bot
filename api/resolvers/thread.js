const { UserInputError } = require('apollo-server');
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
      }).catch(() => {
        throw new UserInputError('ThreadMessage failed to create');
      });
      // error
      if (!message) throw new UserInputError('ThreadMessage failed to create');

      const thread = await Thread.findOneAndUpdate(
        { threadID: args.threadID },
        { $addToSet: { threadMessages: message } },
        {
          new: true,
          useFindAndModify: false
        }
      ).catch(async () => {
        await ThreadMessage.deleteOne({ _id: message._id });
        throw new UserInputError('Thread failed to create');
      });
      if (!thread) throw new UserInputError('Thread update returned null');
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
      }).catch(() => {
        throw new UserInputError('ThreadMessage failed to create');
      });
      // error
      if (!message) throw new UserInputError('ThreadMessage failed to create');

      await Thread.create({
        threadID,
        creatorID,
        guildID,
        topic,
        threadMessages: [message]
      }).catch(async () => {
        await ThreadMessage.deleteOne({ _id: message._id });
        throw new UserInputError('Thread failed to create');
      });
      const thread = await Thread.findOne({
        threadID,
        creatorID,
        guildID
      });
      if (!thread) throw new UserInputError('Thread creation returned null');
      return thread;
    }
  }
};

module.exports = { ThreadQuery, ThreadMutation };
