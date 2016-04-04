"use strict";

const jsUtils = require('../lib/js-utils/index');

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
    const data = new Float32Array(8);
    for (let i = 0; i < data.length; i++) {
      data[i] = 0;
    }
    data[5] = 5;
    const value = {
      worldname,
      args,
      data,
    };
    const result = jsUtils.formatBinary(value);
    cb(null, result);
  },
};

module.exports = worldStreams;
