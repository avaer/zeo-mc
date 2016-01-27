var jsbe = require('../');

var should = require('should');

describe('basic', () => {
  it('should start script and log', function(cb) {
    var script = new jsbe.Script('console.log("lol");');
    script.on('console', function(s) {
      s.should.equal('lol\n');

      script.kill();

      cb();
    });
    script.start();
  });

  it('should error on invalid script', function(cb) {
    var script = new jsbe.Script('console.log(;');
    script.on('error', function(err) {
      err.should.be.ok;

      script.kill();

      cb();
    });
    script.start();
  });
});
