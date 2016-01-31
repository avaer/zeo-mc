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
      worlds = worlds || [];

      let pending = 0, error = null;
      function pend(err) {
        error = error || err;

        pending--;

        checkDone();
      }

      function checkDone() {
        if (pending === 0) {
          done(err);
        }
      }

      function done() {
        cb(error);
      }

      worlds.forEach(name => {
        const world = new World({
          name,
          db: this._db
        });
        world.on('error', err => {
          pend(err);
        });
        world.on('ready', () => {
          const _id = world._id;

          this._worlds.set(_id, world);

          pend();
        });
      });

      if (pending === 0) {
        process.nextTick(cb);
      }
    }).catch(cb);
  }

  createWorld(name, cb) {
    cb(); // XXX
  }
}

class World extends EventEmitter {
  constructor(opts) {
    super();

    this._name = opts.name;
    this._db = opts.db;

    this._world = null;

    this.init();
  }

  init() {
    this._db.getWorld(this._name).then(world => {
      this._world = world;
      this.emit('ready');
    }).catch(err => {
      this.emit('error', err);
    });
  }
}

module.exports = Worlds;
