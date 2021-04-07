const { SystemError, UserInputError } = require('apollo-server');
const { EasterEggTC, EasterEgg } = require('../models/easterEgg');
const { EasterBasket } = require('../models/easterBasket');

const EasterEggQuery = {
  easterEggOne: EasterEggTC.mongooseResolvers.findOne(),
  easterEggMany: EasterEggTC.mongooseResolvers.findMany(),
  easterEggCount: EasterEggTC.mongooseResolvers.count(),
};

const EasterEggMutation = {
  easterEggDelete: {
    args: { guildID: 'String!', eggID: 'String!' },
    type: EasterEggTC,
    resolve: async (source, args) => {
      const { guildID, eggID } = args;
      const egg = await EasterEgg.findOneAndDelete({
        guildID,
        eggID,
      });
      if (!egg) throw new UserInputError('Could not find and delete EasterEgg');

      await EasterBasket.updateMany(null, {
        $pull: { eggs: egg._id },
      });

      return egg;
    },
  },
  easterEggUpdate: {
    type: EasterEggTC,
    args: {
      guildID: 'String!',
      eggID: 'String!',
      newEggID: 'String',
      imageUrl: 'String',
      code: 'String',
      description: 'String',
      hint: 'String',
    },
    resolve: async (source, args) => {
      const { guildID, eggID, imageUrl, code, description, hint } = args;
      let { newEggID } = args;

      if (newEggID) {
        const existingEgg = await EasterEgg.findOne({
          guildID,
          eggID: newEggID,
        });
        if (existingEgg)
          return new UserInputError(
            'Failed to update EasterEgg: newEggID already in use'
          );
      } else {
        newEggID = eggID;
      }

      const egg = await EasterEgg.findOneAndUpdate(
        { guildID, eggID },
        {
          eggID: newEggID,
          imageUrl,
          code,
          description,
          hint,
        },
        {
          useFindAndModify: false,
          new: true,
          omitUndefined: true,
        }
      );
      if (!egg) return new SystemError('Failed to update EasterEgg');

      return egg;
    },
  },
  easterEggCreate: {
    type: EasterEggTC,
    args: {
      guildID: 'String!',
      eggID: 'String!',
      imageUrl: 'String',
      code: 'String',
      description: 'String',
      hint: 'String',
    },
    resolve: async (source, args) => {
      const { guildID, eggID, imageUrl, code, description, hint } = args;

      const existingEgg = await EasterEgg.findOne({ guildID, eggID });
      if (existingEgg)
        return new UserInputError(
          'EggID already in use, EasterEgg not created'
        );

      const egg = await EasterEgg.create({
        guildID,
        eggID,
        imageUrl,
        code,
        description,
        hint,
      });
      if (!egg) return new SystemError('Failed to create EasterEgg');

      return egg;
    },
  },
};

module.exports = { EasterEggQuery, EasterEggMutation };
