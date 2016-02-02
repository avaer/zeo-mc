"use strict";

const eio = require('engine.io');
const u = require('../lib/js-utils');

const STREAMS = [
  'worlds'
];

const allStreams = u.flatten(STREAMS.map(name => require('./' + name + '.js')));

function _connectionRead(handler) {
  this.on('message', s => {
    let result, error = null;
    try {
      result = JSON.parse(s);
      if (typeof result === 'object' && result !== null && (typeof result.event === 'string') && ('data' in result)) {
        // nothing
      } else {
        throw new Error('invalid message');
      }
    } catch(err) {
      error = err;
    }
    if (!error) {
      handler(result.event, result.data);
    } else {
      handler('error', {
        code: 'EPARSE'
      });
    }
  });
}

function _connectionWrite(e, d) {
  const msg = {
    event: e,
    data: d
  };
  const msgJson = JSON.stringify(msg);
  this.send(msgJson);
}

const api = {
  app(opts) {
    const prefix = opts.prefix || '';

    const eios = _makeServer();

    function _makeServer() {
      const eios = new eio.Server({
        transports: ['websocket']
      });

      eios.on('connection', c => {
        const connectionPath = c.request.url.replace(prefix, '').replace(/\/\?.*$/, '');
        const stream = u.find(allStreams, s => s.path === connectionPath);

        const handled = allStreams.some(stream => {
          const match = (() => {
            if (typeof stream.path === 'string') {
              if (connectionPath === stream.path) {
                return [connectionPath];
              } else {
                return null;
              }
            } else if (stream.path instanceof RegExp) {
              return connectionPath.match(stream.path);
            } else {
              return null;
            }
          })();
          if (match) {
            c.params = match;
            c.read = _connectionRead;
            c.write = _connectionWrite;

            const handler = stream.handler;
            handler(c);

            return true;
          } else {
            return false;
          }
        });

        if (!handled) {
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
