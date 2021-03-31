const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const EasterBasketSchema = mongoose.Schema({
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
});

const EasterBasket = mongoose.model('EasterBasket', EasterBasketSchema);
const EasterBasketTC = composeMongoose(EasterBasket);

module.exports = {
  EasterBasket,
  EasterBasketTC,
};
