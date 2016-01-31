"use strict";

const path = require('path');

const pouchdb = require('pouchdb');

const WORLDS_ID = 'worlds';
const WORLD_PREFIX = 'world_';
const NODE_PREFIX = 'node_';

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
    db.dump = o => {
      return new Promise((accept, reject) => {
        db.put(o).then(result => {
          o._rev = result.rev;

          accept(o);
        }).catch(function(err) {
          console.log('fffffffffffffffffffffffffffffff fail', err);

          reject(err);
        });
      });
    };

    this._db = db;
  }

  destroy() {
    return this._db.destroy();
  }

  getWorlds() {
    return this._db.find(WORLDS_ID);
  }

  setWorlds(worlds) {
    const _id = WORLDS_ID;
    const _rev = worlds._rev || 0;
    const o = {_id, _rev, worlds: worlds.worlds};

    return this._db.dump(o);
  }

  getWorld(id) {
    return this._db.find(WORLD_PREFIX + id);
  }

  setWorld(world) {
    const id = world.id;
    const _id = WORLD_PREFIX + id;
    const _rev = world._rev || 0;
    const nodes = world.nodes;
    const o = {_id, _rev, id, nodes};

    return this._db.dump(o);
  }

  getNode(id) {
    return this._db.find(NODE_PREFIX + id);
  }

  setNode(node) {
    const id = node.id;
    const _id = NODE_PREFIX + id;
    const _rev = node._rev || 0;
    const src = node.src;
    const state = node.state;
    const o = {_id, _rev, id, src, state};

    return this._db.dump(o);
  }
}

module.exports = Db;
