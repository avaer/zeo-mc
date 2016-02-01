const eio = require('engine.io');
const u = require('../lib/js-utils');

const STREAMS = [
  'world'
];

const allStreams = u.flatten(STREAMS.map(name => require('./' + name + '.js')));

const api = {
  app(opts) {
    const prefix = opts.prefix || '';

    const eios = _makeServer();

    function _makeServer() {
      const eios = new eio.Server();

      eios.on('connection', c => {
        const s = u.find(allStreams, p => c.path.replace(prefix, '').startsWith(p));

        if (stream) {
          const handler = stream.handler;
          handler(c);
        } else {
          c.close();
        }
      });

      return eios;
    }

    function _isHandledRequest(req) {
      return req.url.startsWith(prefix);
    }

    const app = {
      attach: server => {
        server.on('request', (req, res) => {
          if (_isHandledRequest(req)) {
            eios.handleRequest(req, res);
          }
        });
        server.on('upgrade', (req, socket, head) => {
          if (_isHandledRequest(req)) {
            eios.handleUpgrade(req, socket, head);
          } else {
            socket.destroy();
          }
        });
      }
    };   
    return app;
  }
};

module.exports = api;
