const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');


const Egg = mongoose.Schema(
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
    }
  }
);
const Egg = mongoose.model('Egg', EggSchema);
const EggTC = composeMongoose(Egg);

module.exports = {
  Egg,
  EggSchema,
  EggTC
};
