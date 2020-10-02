const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Schema',
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => 'Hello'
      }
    })
  })
})

module.exports = { schema }
