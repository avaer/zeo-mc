const expressGraphql = require('express-graphql');
const Schema = require('../lib/graphql/schema');

const handler = expressGraphql({ schema: Schema, pretty: true, graphiql: true /* XXX */ });

const routes = [
  {
    path: '/graphql',
    handler: (req, res) => {
      console.log('got req', req.url);

      handler(req, res);
    }
  }
];

module.exports = routes;
