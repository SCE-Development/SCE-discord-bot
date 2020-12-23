const { SystemError, UserInputError } = require('apollo-server');
const { ThreadTC, Thread } = require('../models/thread');
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
        messageID: args.messageID,
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
          useFindAndModify: false,
        }
      ).catch(async () => {
        await ThreadMessage.deleteOne({ _id: message._id });
        throw new UserInputError('Thread failed to create');
      });
      if (!thread) throw new UserInputError('Thread update returned null');
      return thread;
    },
  },
  threadMessageDelete: {
    type: ThreadTC,
    args: { threadID: 'String!', messageID: 'String!' },
    resolve: async (source, args) => {
      let message = await ThreadMessage.findOne({
        messageID: args.messageID,
      });
      if (!message) throw new UserInputError('Failed to find ThreadMessage');
      // I can't get Thread.findOneAndUpdate() to pull null elements
      const thread = await Thread.findOneAndUpdate(
        { threadID: args.threadID },
        {
          $pull: { threadMessages: message._id },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      if (!thread) throw new UserInputError('Thread update returned null');
      message = await ThreadMessage.deleteOne({
        messageID: args.messageID,
      });
      if (!message)
        throw new UserInputError('ThreadMessage remove returned null');
      return thread;
    },
  },
  threadCreate: {
    type: ThreadTC,
    args: {
      threadID: 'String!',
      creatorID: 'String!',
      guildID: 'String!',
      channelID: 'String!',
      topic: 'String',
      messageID: 'String!',
    },
    resolve: async (source, args) => {
      const {
        threadID,
        creatorID,
        guildID,
        channelID,
        topic,
        messageID,
      } = args;
      const message = await ThreadMessage.create({
        messageID,
      }).catch(() => {
        throw new UserInputError('ThreadMessage failed to create');
      });
      // error
      if (!message) throw new UserInputError('ThreadMessage failed to create');

      await Thread.create({
        threadID,
        creatorID,
        guildID,
        channelID,
        topic,
        threadMessages: [message],
      }).catch(async () => {
        await ThreadMessage.deleteOne({ _id: message._id });
        throw new UserInputError('Thread failed to create');
      });
      const thread = await Thread.findOne({
        threadID,
        creatorID,
        guildID,
        channelID,
      });
      if (!thread) throw new UserInputError('Thread creation returned null');
      return thread;
    },
  },
  threadDelete: {
    args: { threadID: 'String!' },
    type: ThreadTC,
    resolve: async (source, args) => {
      const { threadID } = args;
      const thread = await Thread.findOne({ threadID: threadID }).catch(() => {
        throw new UserInputError('Could not find Thread');
      });
      // Error
      if (!thread) throw new UserInputError('Could not find Thread');
      // Delete all ThreadMessages
      await ThreadMessage.deleteMany({
        _id: { $in: thread.threadMessages },
      }).catch(() => {
        throw new SystemError(
          'Failed to delete all ThreadMessages. Thread not deleted.'
        );
      });
      // Delete Thread
      await Thread.deleteOne({ _id: thread._id }).catch(() => {
        throw new SystemError('Failed to delete Thread');
      });

      return thread;
    },
  },
};

module.exports = { ThreadQuery, ThreadMutation };
