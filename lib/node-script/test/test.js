var NodeScript = require('../');

var should = require('should');

describe('basic', function() {
  it('successful render', function(cb) {
    var script = new NodeScript('export function render(s) { return s + "pong"; };');
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

  it('failed render', function(cb) {
    var script = new NodeScript('export function render(s) { throw new Error("fail"); };');
    script.start();
    script.call('render', ['ping'], function(err, result) {
      err.should.ok;

      cb();
	});
    script.on('error', function(err) {
      cb(error);
    });
  });
});
