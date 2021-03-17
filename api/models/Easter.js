const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const EggSchema = mongoose.schema(
{
    guildID: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: false
    },
    code: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    hint: {
      type: String,
      required: false
    },
},
{ collection: 'eggs' });

const EggBasketSchema = mongoose.schema(
{
    guildID: {
      type: String,
      required: true
    },
    userID: {
      type: String,
      required: true
    },
    eggs: [
      {
        type: Egg
      }
    ],
},
{ collection: 'eggBasket' });

const Egg = mongoose.model('eggs', EggSchema);
const EggTC = composeMongoose(Egg);

const EggBasket = mongoose.model('eggBasket', EggBasketSchema);
const EggBasketTC = composeMongoose(EggBasket);
module.exports = {
  Egg,
  EggSchema,
  EggTC,
  EggBasket,
  EggBasketSchema,
  EggBasketTC,
};
