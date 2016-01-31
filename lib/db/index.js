"use strict";

const path = require('path');

const pouchdb = require('pouchdb');
const config = require('../config/index.js').get();

const WORLD_PREFIX = 'world_';

class Db {
  constructor() {
    const databasePath = path.join(config.dataDirectory, 'db');
    const db = new pouchdb(databasePath);

    this._db = db;
  }

  getWorld(name) {
    const _id = WORLD_PREFIX + name;
    return this._db.get(_id);
  }

  setWorld(world) {
    const name = world.name;
    const _id = WORLD_PREFIX + name;
    const _rev = world._rev;

    return this._db.put(world, _id, _rev);
  }
}

module.exports = new Db();
