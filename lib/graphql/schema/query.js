const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLList = graphql.GraphQLList;

const types = require('./types');
const userType = types.userType;
const sessionType = types.sessionType;
const loginType = types.loginType;
const worldType = types.worldType;
const worldsType = types.worldsType;
const chunkType = types.chunkType;

const resolver = require('./resolver');
const resolveLogin = resolver.resolveLogin;
const resolveWorlds = resolver.resolveWorlds;

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    /* hello: {
      type: GraphQLString,
      resolve: () => 'world'
    }, */
    login: {
      type: loginType,
      args: {
        session: {
          name: 'session',
          type: GraphQLString
        },
      },
      resolve: resolveLogin
    },
    worlds: {
      type: worldsType,
      args: {},
      resolve: resolveWorlds
    },
    chunk: {
      type: chunkType,
      args: {
        worldname: {
          name: 'worldname',
          type: GraphQLString
        },
        x: {
          name: 'x',
          type: GraphQLInt
        },
        y: {
          name: 'y',
          type: GraphQLInt
        },
        z: {
          name: 'z',
          type: GraphQLInt
        },
        values: {
          name: 'password',
          type: GraphQLInt
        },
      },
      resolve: resolveLogin
    },
  }
});

module.exports = Query;
