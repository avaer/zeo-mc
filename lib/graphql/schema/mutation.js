const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;

const types = require('./types');
const userType = types.userType;
const sessionType = types.sessionType;
const chunkType = types.chunkType;
const loginType = types.loginType;

const resolver = require('./resolver');
const resolveCreateUser = resolver.resolveCreateUser;
const resolveLogin = resolver.resolveLogin;

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
        passwordHash: {
          name: 'name',
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
  }
});

module.exports = Mutation;
