const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLString = graphql.GraphQLString;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLList = graphql.GraphQLList;

const api = {};

api.userType = new GraphQLObjectType({
  name: 'User',
  // description: 'a user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s id',
    },
    username: {
      type: GraphQLString,
      // description: 'a user\'s name',
    },
    salt: {
      type: GraphQLString,
      // description: 'a user\'s name',
    },
    passwordHash: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s messages'
    }
  })
});

api.chunkType = new GraphQLObjectType({
  name: 'Chunk',
  fields: () => ({
    x: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    y: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    z: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    values: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  })
});

module.exports = api;