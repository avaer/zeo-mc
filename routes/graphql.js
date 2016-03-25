const expressGraphql = require('express-graphql');
const Schema = require('../lib/graphql/schema');

const routes = [
  {
    methods: ['get', 'post'],
    path: '/graphql',
    handler: expressGraphql({ schema: Schema, pretty: true, graphiql: true /* XXX */ })
  }
];

module.exports = routes;
