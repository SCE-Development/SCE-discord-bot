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
  easterEggCreate: {
    type: EasterEggTC,
    args: {
      guildID: "String!",
      eggID: "String!",
      imageUrl: "String",
      code: "String",
      description: "String",
      hint: "String",
    },
    resolve: async (source, args) => {
      const {
        guildID,
        eggID,
        imageUrl,
        code,
        description,
        hint,
      } = args;
      await EasterEgg.create({
        guildID,
        eggID,
        imageUrl,
        code,
        description,
        hint
      });
      const egg = await EasterEgg.findOne({
        guildID,
        eggID,
        imageUrl,
        code, 
        description,
        hint
      });
      return egg;
    } 
  },
  easterEggDeleteOne: {
    type: EasterEggTC,
    args: {
      guildID: "String!",
      eggID: "String!",
      imageUrl: "String",
      code: "String",
      description: "String",
      hint: "String",
    },
    resolve: async (source, args) => {
      const {
        guildID,
        eggID,
        imageUrl,
        code,
        description,
        hint,
      } = args;
      const egg = await EasterEgg.findOne({
        guildID,
        eggID,
        imageUrl,
        code,
        description,
        hint
      });
      await EasterEgg.deleteOne({_id: egg._id});
      return egg;
    }
  }
};

module.exports = { EasterEggQuery, EasterEggMutation };
