const { schemaComposer } = require('graphql-compose');
const { PointQuery, PointMutation } = require('./points');
const { ThreadQuery, ThreadMutation } = require('./thread');
const {
  ThreadMessageQuery,
  ThreadMessageMutation
} = require('./threadMessage');

schemaComposer.Query.addFields({
  ...PointQuery,
  ...ThreadQuery,
  ...ThreadMessageQuery,
});

schemaComposer.Mutation.addFields({
  ...PointMutation,
  ...ThreadMutation,
  ...ThreadMessageMutation,
});

const schema = schemaComposer.buildSchema();

module.exports = { schema };
