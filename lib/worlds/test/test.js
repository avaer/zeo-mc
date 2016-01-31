var path = require('path');

var rimraf = require('rimraf');

var config = require('../../config');
var Db = require('../../db');

var Worlds = require('../');

require('should');

var TEST_DATABASE_PATH = path.join('/', 'tmp', 'worlds-test');
var TEST_WORLD_NAME = 'test-world';

var db = null;
function resetDb(cb) {
  db = null;

  rimraf(TEST_DATABASE_PATH, function() {
    db = new Db(TEST_DATABASE_PATH);

    cb();
  });
}
beforeEach(resetDb);

describe('basic', function() {
  it('create worlds', function(cb) {
    var worlds = new Worlds({
      db: db
    });
    worlds.on('ready', function() {
      worlds.createWorld(TEST_WORLD_NAME, function(err, world) {
        if (!err) {
          cb(); // XXX
        } else {
          cb(err);
        }
      });
    });
  });
});
