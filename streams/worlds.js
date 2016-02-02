const worlds = require('../lib/worlds-instance');

const worldStreams = [
  {
    path: /^\/worlds\/([^\/]+)$/,
    handler: c => {
      const id = c.params[1];
      const world = worlds.getWorld(id);

      if (world) {
        console.log('got connection to world', id);

        world.forEachCachedRender(d => {
          c.write('render', d);
        });

        const handleRender = d => {
          c.write('render', d);
        };
        world.on('render', handleRender);
        c.on('close', () => {
          world.removeListener('render', handleRender);
        });

        c.read((e, d) => {
          console.log('got message', e, d);
        });
      } else {
        console.log('failed to get connection to world', id);

        c.write('error', {
          code: 'ENOENT'
        });
        c.close();
      }
    }
  }
];

module.exports = worldStreams;
