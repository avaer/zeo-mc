var NodeScript = require('../');

var should = require('should');

describe('basic', function() {
  it('call', function(cb) {
    var script = new NodeScript('export function render(s, cb) { cb(null, s + "pong"); };');
    script.start();
    script.call('render', ['ping'], function(err, result) {
      (err === null).should.be.ok;
      result.should.equal('pingpong');

      cb();
	});
    script.on('error', function(err) {
      cb(error);
    });
  });
});
