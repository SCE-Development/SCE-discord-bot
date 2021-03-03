const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');


const EggBasket = mongoose.Schema(
  {
    guildID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: false
    },
    eggs: [
        {
            type: Egg
        }
      ]
    }
);
const EggBasket = mongoose.model('EggBasket', EggBasketSchema);
const EggBasketTC = composeMongoose(EggBasket);

module.exports = {
  EggBasket,
  EggBacketSchema,
  EggBasketTC
};
