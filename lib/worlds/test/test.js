var path = require('path');

var rimraf = require('rimraf');

var config = require('../../config');
var Db = require('../../db');
var jsUtils = require('../../js-utils');

var Worlds = require('../');

require('should');

var TEST_DATABASE_PATH = path.join('/', 'tmp', 'worlds-test');
var TEST_WORLD_ID = 'test-world';

var db = null;
function resetDb(cb) {
  db = null;

  rimraf(TEST_DATABASE_PATH, function() {
    db = new Db(TEST_DATABASE_PATH);

    cb();
  });
}
beforeEach(resetDb);

function _makeWorlds(cb) {
  var worlds = new Worlds({
    db: db
  });
  worlds.on('ready', function() {
    cb(null, worlds);
  });
  worlds.on('error', function(err) {
    cb(err);
  });
}

describe('basic', function() {
  it('create worlds', function(cb) {
    _makeWorlds(jsUtils.ok(cb, function(worlds) {
      worlds.createWorld(TEST_WORLD_ID, jsUtils.ok(cb, function(world) {
        _makeWorlds(jsUtils.ok(cb, function(worlds2) {
          var world = worlds2.getWorld(TEST_WORLD_ID);
          world.should.be.an.instanceOf(Worlds.World);
          world.getId().should.equal(TEST_WORLD_ID);

          cb();
        }));
      }));
    }));
  });
});
