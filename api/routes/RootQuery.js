const { GraphQLObjectType } = require("graphql");


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    points: {
    }
  })
})

module.exports = { RootQueryType }
