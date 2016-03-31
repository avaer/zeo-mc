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
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s name',
    },
    salt: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s name',
    },
    passwordHash: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s messages'
    },
    gender: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s messages'
    },
  })
});
api.sessionType = new GraphQLObjectType({
  name: 'Session',
  // description: 'a user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s id',
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s name',
    },
    session: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s name',
    },
  })
});
api.worldType = new GraphQLObjectType({
  name: 'World',
  fields: () => ({
    worldname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    seed: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
});
api.chunkType = new GraphQLObjectType({
  name: 'Chunk',
  fields: () => ({
    worldname: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
api.loginType = new GraphQLObjectType({
  name: 'Login',
  // description: 'a user',
  fields: () => ({
    user: {
      type: api.userType,
      // description: 'a user\'s id',
    },
    session: {
      type: new GraphQLNonNull(GraphQLString),
      // description: 'a user\'s id',
    },
  })
});

module.exports = api;
