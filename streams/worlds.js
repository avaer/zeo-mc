const worldStreams = [
  {
    path: /^\/worlds\/([^\/]+)$/,
    handler: c => {
      /* const id = c.params[1];
      const world = worlds.getWorld(id);

      if (world) {
        console.log('got connection to world', id);

        world.forEachNode(node => {
          const nodeData = node.getData();
          c.write('nodeUpdate', nodeData);
        });

        const handleNodeUpdate = d => {
          c.write('nodeUpdate', d);
        };
        world.on('nodeUpdate', handleNodeUpdate);
        c.on('close', () => {
          world.removeListener('nodeUpdate', handleNodeUpdate);
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
      } */
    }
  }
];

module.exports = worldStreams;
