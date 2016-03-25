const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLList = graphql.GraphQLList;

const types = require('./types');
const userType = types.userType;

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
      type: userType,
      args: {
        name: {
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
