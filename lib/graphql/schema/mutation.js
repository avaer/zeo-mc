const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLBoolean = graphql.GraphQLBoolean;

const types = require('./types');
const userType = types.userType;
const sessionType = types.sessionType;
const loginType = types.loginType;
const worldType = types.worldType;
const chunkType = types.chunkType;

const resolver = require('./resolver');
const resolveCreateUser = resolver.resolveCreateUser;
const resolveLogin = resolver.resolveLogin;
const resolveCreateWorld = resolver.resolveCreateWorld;
const resolveDeleteWorld = resolver.resolveDeleteWorld;

const Mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: userType,
      args: {
        name: {
          name: 'name',
          type: GraphQLString
        },
        password: {
          name: 'name',
          type: GraphQLString
        },
        gender: {
          name: 'gender',
          type: GraphQLString
        },
      },
      resolve: resolveCreateUser
    },
    login: {
      type: loginType,
      args: {
        username: {
          name: 'username',
          type: GraphQLString
        },
        password: {
          name: 'password',
          type: GraphQLString
        },
      },
      resolve: resolveLogin
    },
    createWorld: {
      type: worldType,
      args: {
        worldname: {
          name: 'worldname',
          type: GraphQLString
        },
      },
      resolve: resolveCreateWorld
    },
    deleteWorld: {
      type: GraphQLBoolean,
      args: {
        worldname: {
          name: 'worldname',
          type: GraphQLString
        },
      },
      resolve: resolveDeleteWorld
    },
  }
});

module.exports = Mutation;
