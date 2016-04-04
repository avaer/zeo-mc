"use strict";

const ws = require('ws');
const u = require('../lib/js-utils');

const STREAMS = [
  'worlds'
];

const allStreams = u.flatten(STREAMS.map(name => require('./' + name + '.js')));

const api = {
  app(opts) {
    const prefix = opts.prefix || '';

    const app = server => {
      const wss = new ws.Server({server});

      wss.on('connection', c => {
        const url = c.upgradeReq.url;
        if (url.indexOf(prefix) === 0) {
          const connectionPath = url.replace(prefix, '');

          const handled = allStreams.some(stream => {
            const match = (() => {
              if (typeof stream.path === 'string') {
                return connectionPath === stream.path;
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
              c.write = _connectionWrite;
              c.read = _connectionRead;

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
        }
      });
    };   
    return app;
  }
};

function _connectionWrite(event, data) {
  const o = {event, data};
  const s = JSON.stringify(o);
  this.send(s);
}

function _connectionRead(fn) {
  this.on('message', s => {
    const o = _jsonParse(s);
    if (o && typeof o === 'object') {
      const event = o.event;
      const data = o.data;
      if (typeof event === 'string' && typeof data !== 'undefined') {
        fn(event, data);
      } else {
        this.close();
      }
    } else {
      this.close();
    }
  });
}

function _jsonParse(s) {
  let result, error = null;
  try {
    result = JSON.parse(s);
  } catch (err) {
    error = err;
  }
  if (!error) {
    return result;
  } else {
    return null;
  }
}

module.exports = api;
