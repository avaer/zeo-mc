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
    cb(null, {
      worldname,
      args,
      lol: 'zol',
    });
  },
};

module.exports = worldStreams;
