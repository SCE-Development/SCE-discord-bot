const mongoose = require('mongoose');
const { composeMongoose } = require('graphql-compose-mongoose');

const GuildConfigSchema = mongoose.Schema(
    {
        guildID: {
            type: String,
            required: true,
        },
        eggHunt: {
            channels: [
                {
                    type: String,
                }
            ]
        }
    },
    { collection: 'GuildConfig' });

const guildConfig = mongoose.model('GuildConfig', GuildConfigSchema);
const guildConfigTC = composeMongoose(guildConfig);

module.exports = {
    guildConfig,
    guildConfigTC,
    GuildConfigSchema,
}