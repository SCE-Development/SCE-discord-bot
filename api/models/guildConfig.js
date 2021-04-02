const mongoose = require('mongoose');
const { schemaComposer } = require('graphql-compose');
const { composeMongoose } = require('graphql-compose-mongoose');

const GuildConfigSchema = mongoose.Schema({
  guildID: {
    type: String,
    required: true,
    unique: true,
  },
  easter: {
    eggChannels: [
      {
        channelID: { type: String, required: true },
        egg: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'EasterEgg',
          required: true,
        },
        period: { type: Number, default: 30 },
      },
    ],
  },
});

const GuildConfigITC = schemaComposer.createInputTC({
  name: 'GuildConfigInput',
  fields: {
    guildID: 'String!',
    easter: {
      type: 'JSON',
      eggChannels: [
        {
          channelID: { type: String, required: true },
          egg: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EasterEgg',
            required: true,
          },
          period: { type: Number, default: 30 },
        },
      ],
    },
  },
});

const GuildConfig = mongoose.model('GuildConfig', GuildConfigSchema);
const GuildConfigTC = composeMongoose(GuildConfig);

module.exports = {
  GuildConfig,
  GuildConfigTC,
  GuildConfigITC,
};
