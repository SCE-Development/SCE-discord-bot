const { SystemError, UserInputError } = require('apollo-server');
const { EasterEggTC, EasterEgg } = require('../models/easterEgg');

const EasterEggQuery = {
  easterEggOne: EasterEggTC.mongooseResolvers.findOne(),
  easterEggMany: EasterEggTC.mongooseResolvers.findMany(),
  easterEggCount: EasterEggTC.mongooseResolvers.count(),
};

const EasterEggMutation = {
  easterEggCreateOne: EasterEggTC.mongooseResolvers.createOne(),
  easterEggUpdateOne: EasterEggTC.mongooseResolvers.updateOne(),
  easterEggRemoveOne: EasterEggTC.mongooseResolvers.removeOne(),
  easterEggRemoveMany: EasterEggTC.mongooseResolvers.removeMany(),
};

module.exports = { EasterEggQuery, EasterEggMutation };
