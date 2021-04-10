const { SystemError, UserInputError } = require('apollo-server');
const { EasterBasketTC, EasterBasket } = require('../models/easterBasket');
const { EasterEgg } = require('../models/easterEgg');

const EasterBasketQuery = {
  easterBasketOne: EasterBasketTC.mongooseResolvers.findOne(),
  easterBasketMany: EasterBasketTC.mongooseResolvers.findMany(),
  easterBasketCount: EasterBasketTC.mongooseResolvers.count(),
};

const EasterBasketMutation = {
  easterBasketCreateOne: EasterBasketTC.mongooseResolvers.createOne(),
  easterBasketRemoveOne: EasterBasketTC.mongooseResolvers.removeOne(),
  easterBasketRemoveMany: EasterBasketTC.mongooseResolvers.removeMany(),
  easterBasketAddEgg: {
    type: EasterBasketTC,
    args: {
      guildID: 'String!',
      userID: 'String!',
      eggID: 'String!',
    },
    resolve: async (source, args) => {
      const { guildID, userID, eggID } = args;

      const egg = await EasterEgg.findOne({ guildID, eggID });
      if (!egg) return new UserInputError('Failed to find EasterEgg');

      let basket = await EasterBasket.findOneAndUpdate(
        { guildID, userID },
        { $addToSet: { eggs: egg } },
        { new: true, upsert: true, useFindAndModify: false }
      );
      if (!basket)
        return new SystemError(
          'Failed to find and update or create EasterBasket'
        );

      return basket;
    },
  },
  easterBasketRemoveEgg: {
    type: EasterBasketTC,
    args: {
      guildID: 'String!',
      userID: 'String!',
      eggID: 'String!',
    },
    resolve: async (source, args) => {
      const { guildID, userID, eggID } = args;

      const egg = await EasterEgg.findOne({ guildID, eggID });
      if (!egg) return new UserInputError('Failed to find EasterEgg');

      const basket = await EasterBasket.findOneAndUpdate(
        { guildID, userID },
        { $pull: { eggs: egg._id } },
        { new: true, useFindAndModify: false }
      );
      if (!basket)
        return new SystemError('Failed to find and update EasterBasket');

      return basket;
    },
  },
};

module.exports = { EasterBasketQuery, EasterBasketMutation };
