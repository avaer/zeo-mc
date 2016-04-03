const graphql = require('graphql');
const GraphQLSchema = graphql.GraphQLSchema;

const Query = require('./query');
const Mutation = require('./mutation');

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = Schema;
