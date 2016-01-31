"use strict";

const events = require('events');
const EventEmitter = events.EventEmitter;

class Worlds extends EventEmitter {
  constructor(opts) {
    super();

    this._db = opts.db;
    this._worlds = new Map();

    this.init();
  }

  init() {
    const cb = err => {
      if (!err) {
        this.emit('ready');
      } else {
        this.emit('error', err);
      }
    };

    this._db.getWorlds().then(worlds => {
      worlds = worlds || {
        worlds: []
      };

      const worldsToLoad = worlds.worlds;
      let pending = worldsToLoad.length, error = null;
      function pend(err) {
        error = error || err;

        pending--;

        checkDone();
      }

      function checkDone() {
        if (pending === 0) {
          done();
        }
      }

      function done() {
        if (!error) {
          cb(error);
        } else {
          cb();
        }
      }

      worldsToLoad.forEach(id => {
        const world = new World({
          world: {
            id
          },
          db: this._db
        });
        world.init();
        world.on('ready', () => {
          this._worlds.set(world.getId(), world);

          pend();
        });
        world.on('error', err => {
          pend(err);
        });
      });

      if (pending === 0) {
        process.nextTick(cb);
      }
    }).catch(cb);
  }

  getWorld(id) {
    return this._worlds.get(id) || null;
  }

  createWorld(id, cb) {
    const world = new World({
      world: {
        id,
        nodes: []
      },
      db: this._db
    });
    this._worlds.set(id, world);

    this._db.setWorld(world.toJSON()).then(world => {
      this._db.setWorlds(this.toJSON()).then(() => {
        cb();
      }).catch(cb);
    }).catch(cb);
  }

  toJSON() {
    const worlds = [];
    this._worlds.forEach(world => {
      worlds.push(world.getId());
    });
    return {worlds};
  }
}

class World extends EventEmitter {
  constructor(opts) {
    super();

    this._world = opts.world || null;
    this._db = opts.db;
  }

  getId() {
    return this._world.id;
  }

  init() {
    this._db.getWorld(this.getId()).then(world => {
      this._world = world;
      this.emit('ready');
    }).catch(err => {
      this.emit('error', err);
    });
  }

  toJSON() {
    return this._world;
  }
}
Worlds.World = World;

module.exports = Worlds;
