const express = require('express');
const u = require('../lib/js-utils');

const ROUTE_NAMES = ['static', 'graphql'];
const allRoutes = u.flatten(ROUTE_NAMES.map(name => require('./' + name + '.js')));

const api = {
  app() {
    const app = express();

    allRoutes.forEach(route => {
      const methods = (() => {
        if (route.method) {
          return [route.method];
        } else if (route.methods) {
          return route.methods;
        } else {
          return ['get'];
        }
      })();
      const path = route.path;
      const handler = Array.isArray(route.handler) ? route.handler : [ route.handler ];

      methods.forEach(method => {
        app[method](path, handler);
      });
    });

    return app;
  }
};

module.exports = api;
