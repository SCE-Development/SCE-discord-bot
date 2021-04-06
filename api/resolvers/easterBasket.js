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
      const egg = await EasterEgg.findOne({guildID: guildID, eggID: eggID});
      const basket = await EasterBasket.findOne({guildID, userID});
      if(!basket) {
        await EasterBasket.create({
          guildID,
          userID,
        });
      }
      const mutation = await EasterBasket.findOneAndUpdate(
        {guildID, userID},
        { $addToSet: { eggs: egg._id} },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      return mutation;
    },
  },
};

module.exports = { EasterBasketQuery, EasterBasketMutation };
