const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;

const types = require('./types');
const userType = types.userType;

const resolver = require('./resolver');
const resolveCreateUser = resolver.resolveCreateUser;

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
  }
});

module.exports = Mutation;
