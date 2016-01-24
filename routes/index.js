const express = require('express');
const u = require('../lib/js-utils');

const ROUTE_NAMES = ['static', 'import', 'world', 'player'];
const allRoutes = u.flatten(ROUTE_NAMES.map(name => require('./' + name + '.js')));

const api = {
  app() {
    const app = express();

    allRoutes.forEach(route => {
      const method = route.method || 'get';
      const path = route.path;
      const handler = Array.isArray(route.handler) ? route.handler : [ route.handler ];

      app[method](path, handler);
    });

    return app;
  }
};

module.exports = api;
