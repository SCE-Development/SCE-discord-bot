const { schemaComposer } = require('graphql-compose');
const { PointQuery, PointMutation } = require('./points');
const { ThreadQuery, ThreadMutation } = require('./thread');
const { GuildConfigQuery, GuildConfigMutation } = require('./guildConfig');
const {
  ThreadMessageQuery,
  ThreadMessageMutation,
} = require('./threadMessage');
const { EasterEggQuery, EasterEggMutation } = require('./easterEgg');
const { EasterBasketQuery, EasterBasketMutation } = require('./easterBasket');

schemaComposer.Query.addFields({
  ...PointQuery,
  ...ThreadQuery,
  ...ThreadMessageQuery,
  ...GuildConfigQuery,
  ...EasterEggQuery,
  ...EasterBasketQuery,
});

schemaComposer.Mutation.addFields({
  ...PointMutation,
  ...ThreadMutation,
  ...ThreadMessageMutation,
  ...GuildConfigMutation,
  ...EasterEggMutation,
  ...EasterBasketMutation,
});

const schema = schemaComposer.buildSchema();

module.exports = { schema };
