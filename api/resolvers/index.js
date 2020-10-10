const { schemaComposer } = require('graphql-compose');
const { PointQuery, PointMutation } = require('../resolvers/points');



schemaComposer.Query.addFields({
  ...PointQuery,
});

schemaComposer.Mutation.addFields({
  ...PointMutation,
});

const schema = schemaComposer.buildSchema();

module.exports = { schema };
