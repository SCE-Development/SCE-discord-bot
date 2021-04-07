const mongoose = require('mongoose');
const { schemaComposer } = require('graphql-compose');
const { composeMongoose } = require('graphql-compose-mongoose');
const { EasterEggTC } = require('./easterEgg');

const GuildConfigSchema = mongoose.Schema(
  {
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
          },
          period: { type: Number, default: 30 },
        },
      ],
    },
  }
);

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
          },
          period: { type: Number, default: 30 },
        },
      ],
    },
  },
});

const GuildConfig = mongoose.model('GuildConfig', GuildConfigSchema);
const GuildConfigTC = composeMongoose(GuildConfig);

GuildConfigTC.getFieldOTC('easter')
  .getFieldOTC('eggChannels')
  .addRelation('egg', {
    resolver: () => EasterEggTC.mongooseResolvers.dataLoader(),
    prepareArgs: {
      _id: source => source.egg,
    },
    projection: { egg: true },
  });

module.exports = {
  GuildConfig,
  GuildConfigTC,
  GuildConfigITC,
};
