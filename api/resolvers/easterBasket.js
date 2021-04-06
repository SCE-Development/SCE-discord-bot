const { SystemError, UserInputError } = require('apollo-server');
const { EasterBasketTC, EasterBasket } = require('../models/easterBasket');

const EasterBasketQuery = {
  easterBasketOne: EasterBasketTC.mongooseResolvers.findOne(),
  easterBasketMany: EasterBasketTC.mongooseResolvers.findMany(),
  easterBasketCount: EasterBasketTC.mongooseResolvers.count(),
};

const EasterBasketMutation = {
  easterBasketCreateOne: EasterBasketTC.mongooseResolvers.createOne(),
  easterBasketUpdateOne: EasterBasketTC.mongooseResolvers.updateOne(),
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
      const {guildID, userID, eggID } = args;

      const egg = await EasterBasket.findOneAndUpdate(
        {guildID, userID},
        { $addToSet: { eggs: eggID } },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      if (!egg) throw new UserInputError('egg update returned null');
      return egg;
    },
  },
};

module.exports = { EasterBasketQuery, EasterBasketMutation };
