"use strict";

const jsUtils = require('../lib/js-utils/index');
const worlds = require('../lib/worlds/index');

const worldStreams = [
  {
    path: /^\/worlds\/([^\/]+)$/,
    handler: c => {
      const worldname = c.params[1];

      c.read((event, data) => {
        if (event === 'request' && data && typeof data === 'object') {
          const method = data.method;
          const handler = handlers[method];
          if (handler) {
            const id = data.id;
            const args = data.args;
            handler(worldname, args, (error, result) => {
              if (!error) {
                c.write('response', {
                  id,
                  result
                });
              } else {
                c.write('response', {
                  id,
                  error
                });
              }
            });
          } else {
            c.close();
          }
        } else {
          c.close();
        }
      });
    }
  }
];

const handlers = {
  getChunk: function(worldname, args, cb) {
    if (args && typeof args === 'object' && Array.isArray(args.position) && args.position.length === 3) {
      const position = args.position;
      const chunkSpec = {
        worldname,
        position,
      };
      worlds.getWorld(worldname).getChunk(chunkSpec, (err, value) => {
        if (!err) {
          const result = jsUtils.formatBinary(value);
          cb(null, result);
        } else {
          cb(err);
        }
      });
    } else {
      cb('invalid arguments');
    }
  },
};

module.exports = worldStreams;
