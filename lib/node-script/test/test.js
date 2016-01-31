var NodeScript = require('../');

var should = require('should');

describe('basic', function() {
  it('successful render', function(cb) {
    var script = new NodeScript({
      props: 'pi',
      state: 'ng',
      src: 'export function render(props, state) { return <div>{props + state + "pong"}</div>; };'
    });
    script.start();
    script.render(function(err, result) {
      (err === null).should.be.ok;
      result.should.deepEqual({
        type: 'div',
        props: {},
        children: 'pingpong'
      });

      cb();
	});
    script.on('error', function(err) {
      cb(err);
    });
  });

  it('failed render', function(cb) {
    var script = new NodeScript({
      src: 'export function render(s) { throw new Error("fail"); };'
    });
    script.start();
    script.render(function(err, result) {
      err.should.ok;

      cb();
	});
    script.on('error', function(err) {
      cb(err);
    });
  });

  it('default render', function(cb) {
    var script = new NodeScript({
      src: 'export function lol(s) { return "lol"; };'
    });
    script.start();
    script.render(function(err, result) {
      (err === null).should.be.ok;
      result.should.deepEqual({
        type: 'div',
        props: {},
        children: []
      });

      cb();
	});
    script.on('error', function(err) {
      cb(err);
    });
  });

  it('bad render', function(cb) {
    var script = new NodeScript({
      src: 'export function render(s) { return {}; };'
    });
    script.start();
    script.render(function(err, result) {
      (err === null).should.be.ok;
      result.should.deepEqual({
        type: 'div',
        props: {},
        children: []
      });

      cb();
	});
    script.on('error', function(err) {
      cb(err);
    });
  });
});
