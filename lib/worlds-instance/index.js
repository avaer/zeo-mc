"use strict";

const events = require('events');
const EventEmitter = events.EventEmitter;

const u = require('../js-utils');
const Worlds = require('../worlds');
const db = require('../db-instance');

const TEST_WORLD_ID = 'test-world';
const TEST_NODE_ID = 'test-world-node';
const TEST_NODE_SRC = 'function lol() {\n}\n';
const TEST_NODE_STATE = {};

const worlds = new Worlds({db});

function _createWorld(worlds, cb) {
  worlds.createWorld(TEST_WORLD_ID, cb);
}

function _createNode(world, cb) {
  world.createNode({
    id: TEST_NODE_ID,
    src: TEST_NODE_SRC,
    state: TEST_NODE_STATE
  }, cb);
}

worlds.onready = (onready => {
  return cb => {
    onready(u.ok(cb, () => {
      const world = worlds.getWorld(TEST_WORLD_ID);
      if (!world) {
        _createWorld(worlds, u.ok(cb, world => {
          _createNode(world, u.ok(cb, node => { cb(); }));
        }))
      } else {
        const node = world.getNode(TEST_NODE_ID);
        if (!node) {
          _createNode(world, u.ok(cb, node => { cb(); }));
        } else {
          cb();
        }
      }
    }));
  };
})(worlds.onready.bind(worlds));

module.exports = worlds;
