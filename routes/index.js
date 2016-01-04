const express = require('express');

const allRoutes = ['import', 'world', 'player'].map(name => require('./' + name + '.js'));

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

modules.exports = api;
