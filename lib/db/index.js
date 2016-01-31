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
    const _id = WORLDS_ID;
    const _rev = worlds._rev || 0;
    const o = {worlds: worlds.worlds};

    return this._db.put(o, _id, _rev);
  }

  getWorld(id) {
    return this._db.find(WORLD_PREFIX + id);
  }

  setWorld(world) {
    const id = world.id;
    const _id = WORLD_PREFIX + id;
    const _rev = world._rev || 0;
    const nodes = world.nodes;
    const o = {id, nodes};

    return this._db.put(o, _id, _rev);
  }
}

module.exports = Db;
