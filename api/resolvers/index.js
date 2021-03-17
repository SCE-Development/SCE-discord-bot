const { schemaComposer } = require('graphql-compose');
const { PointQuery, PointMutation } = require('./points');
const { ThreadQuery, ThreadMutation } = require('./thread');
const { CCQuery, CCMutation } = require('./customcommand');
const { guildConfigQuery, guildConfigMutation } = require('./guildConfig');
const {
  ThreadMessageQuery,
  ThreadMessageMutation
} = require('./threadMessage');

schemaComposer.Query.addFields({
  ...PointQuery,
  ...ThreadQuery,
  ...ThreadMessageQuery,
  ...CCQuery,
  ...guildConfigQuery,
});

schemaComposer.Mutation.addFields({
  ...PointMutation,
  ...ThreadMutation,
  ...ThreadMessageMutation,
  ...CCMutation,
  ...guildConfigMutation,
});

const schema = schemaComposer.buildSchema();

module.exports = { schema };
