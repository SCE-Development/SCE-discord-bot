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
};

module.exports = { EasterBasketQuery, EasterBasketMutation };
