const expressGraphql = require('express-graphql');
const Schema = require('../lib/graphql/schema');
const db = require('../lib/graphql/database');

const routes = [
  {
    path: '/graphql/:path*',
    handler: expressGraphql({ schema: Schema, pretty: true, graphiql: true })
  }
];

module.exports = routes;
