const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const EasterEggSchema = mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  hint: {
    type: String,
    required: false,
  },
});

const EasterEgg = mongoose.model('EasterEgg', EasterEggSchema);
const EasterEggTC = composeMongoose(EasterEgg);

module.exports = {
  EasterEgg,
  EasterEggTC,
};
