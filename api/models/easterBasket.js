const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');
const { EasterEggTC } = require('./easterEgg');

const EasterBasketSchema = mongoose.Schema(
  {
    guildID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    eggs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EasterEgg',
      },
    ],
  }
);

const EasterBasket = mongoose.model('EasterBasket', EasterBasketSchema);
const EasterBasketTC = composeMongoose(EasterBasket);

EasterBasketTC.addRelation('eggs', {
  resolver: () => EasterEggTC.mongooseResolvers.dataLoaderMany(),
  prepareArgs: {
    _ids: source => source.eggs || [],
  },
  projection: { eggs: true },
});

module.exports = {
  EasterBasket,
  EasterBasketTC,
};
