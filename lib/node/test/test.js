var Node = require('../');

var should = require('should');

describe('basic', function() {
  it('successful render', function(cb) {
    var script = new Node({
      props: 'pi',
      state: 'ng',
      src: 'export function render(props, state) { return <div>{props + state + "pong"}</div>; };'
    });
    script.start();
    script.on('render', function(result) {
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
    var script = new Node({
      src: 'export function render(s) { throw new Error("fail"); };'
    });
    script.start();
    script.on('render', function(result) {
      cb(new Error('successfully rendered'));
    });
    script.on('error', function(err) {
      cb();
    });
  });

  it('default render', function(cb) {
    var script = new Node({
      src: 'export function lol(s) { return "lol"; };'
    });
    script.start();
    script.on('render', function(result) {
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
    var script = new Node({
      src: 'export function render(s) { return {}; };'
    });
    script.start();
    script.on('render', function(result) {
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
