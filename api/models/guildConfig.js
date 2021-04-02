const mongoose = require('mongoose');
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
        egg: { type: mongoose.Schema.Types.ObjectId, ref: 'EasterEgg' },
        period: { type: Number, default: 30 },
      },
    ],
  },
});

const GuildConfig = mongoose.model('GuildConfig', GuildConfigSchema);
const GuildConfigTC = composeMongoose(GuildConfig);

module.exports = {
  GuildConfig,
  GuildConfigTC,
};
