const importRoute = require('./import.js');

const allRoutes = [
  importRoute
];

const api = {
  bind(app) {
    allRoutes.forEach(route => {
      const method = route.method || 'get';
      const path = route.path;
      const handler = route.handler;

      app[method](path, handler);
    });
  }
};

modules.exports = api;
