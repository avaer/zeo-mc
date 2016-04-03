const worldStreams = [
  {
    path: /^\/worlds\/([^\/]+)$/,
    handler: c => {
      console.log('got world connection');

      c.read((type, data) => {
        console.log('got world event', {type, data});

        c.write(type, data);
      });
    }
  }
];

module.exports = worldStreams;
