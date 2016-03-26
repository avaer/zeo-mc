const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLList = graphql.GraphQLList;

const types = require('./types');
const userType = types.userType;
const chunkType = types.chunkType;
const loginType = types.loginType;

const resolver = require('./resolver');
const resolveLogin = resolver.resolveLogin;

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'world'
    },
    login: {
      type: loginType,
      args: {
        username: {
          name: 'name',
          type: GraphQLString
        },
        password: {
          name: 'password',
          type: GraphQLString
        },
      },
      resolve: resolveLogin
    },
    chunk: {
      type: chunkType,
      args: {
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
    /* users: {
      type: new GraphQLList(userType),
      args: {
        name: {
          name: 'name',
          type: GraphQLString
        }
      },
      resolve: resolveUsers
    } */
  }
});

module.exports = Query;
