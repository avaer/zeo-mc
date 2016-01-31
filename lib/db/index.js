"use strict";

const path = require('path');

const pouchdb = require('pouchdb');

const WORLDS_ID = 'worlds';
const WORLD_PREFIX = 'world_';

class Db {
  constructor(p) {
    const db = new pouchdb(p);
    db.find = query => {
      return new Promise((accept, reject) => {
        db.get(query).then(accept).catch(err => {
          if (err.name === 'not_found') {
            accept(null);
          } else {
            reject(err);
          }
        });
      });
    };

    this._db = db;
  }

  getWorlds() {
    return this._db.find(WORLDS_ID);
  }

  setWorlds(worlds) {
    const _rev = worlds._rev;
    return this._db.set(worlds, WORLDS_ID, _rev);
  }

  getWorld(name) {
    const _id = WORLD_PREFIX + name;
    return this._db.find(_id);
  }

  setWorld(world) {
    const name = world.name;
    const _id = WORLD_PREFIX + name;
    const _rev = world._rev;

    return this._db.put(world, _id, _rev);
  }
}

module.exports = Db;
