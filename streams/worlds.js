const worlds = require('../lib/worlds-instance');

const worldStreams = [
  {
    path: /^\/worlds\/([^\/]+)$/,
    handler: c => {
      const id = c.params[1];
      console.log('got connection to world', id); // XXX load render/push changes here
    }
  }
];

module.exports = worldStreams;
