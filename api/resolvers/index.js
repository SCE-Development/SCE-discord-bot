const { schemaComposer } = require('graphql-compose');
const { PointQuery, PointMutation } = require('./points');
const { ThreadQuery, ThreadMutation } = require('./thread');
const { CCQuery, CCMutation } = require('./customcommand');
const {
  ThreadMessageQuery,
  ThreadMessageMutation
} = require('./threadMessage');

schemaComposer.Query.addFields({
  ...PointQuery,
  ...ThreadQuery,
  ...ThreadMessageQuery,
  ...CCQuery,
});

schemaComposer.Mutation.addFields({
  ...PointMutation,
  ...ThreadMutation,
  ...ThreadMessageMutation,
  ...CCMutation,
});

const schema = schemaComposer.buildSchema();

module.exports = { schema };
