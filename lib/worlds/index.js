"use strict";

const events = require('events');
const EventEmitter = events.EventEmitter;

const React = require('react');
const ReactDomServer = require('react-dom/server');

const NodeInstance = require('../node-instance');

function _renderElement(element) {
  return ReactDomServer.renderToStaticMarkup(_createElement(element));
}
function _createElement(element) {
  return React.createElement(element.tag, element.props, _createElementChildren(element.children));
}
function _createElementChildren(children) {
  if (typeof children === 'string') {
    return children;
  } else if (Array.isArray(children)) {
    return children.map(_createElement);
  } else {
    return null;
  }
}

function _single(handler) {
  let queue = [];

  function next() {
    if (queue.length > 0) {
      const promise = queue.shift();
      promise.trigger();
    }
  }

  return function() {
    const promise = new Promise(function(accept, reject) {
      promise.trigger = function() {
        handler().then(function(result) {
          accept(result);

          next();
        }).catch(function(error) {
          reject(error);

          next();
        });
      };
    });

    queue.push(promise);

    next();

    return promise;
  };
}

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
      _pender(worldsToLoad, (id, pend) => {
        const world = new World({
          world: {
            id
          },
          db: this._db
        });
        world.load();
        world.on('ready', () => {
          this._worlds.set(world.getId(), world);

          pend();
        });
        world.on('error', err => {
          pend(err);
        });
      }, cb);
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
    this._worlds.set(world.getId(), world);

    this._db.setWorld(world.toJSON()).then(newWorld => {
      world._world = newWorld;

      this._db.setWorlds(this.toJSON()).then(() => {
        cb(null, world);
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

    this._world = opts.world;
    this._db = opts.db;
  }

  getId() {
    return this._world.id;
  }

  load() {
    const cb = err => {
      if (!err) {
        this.emit('ready');
      } else {
        this.emit('error', err);
      }
    };

    this._db.getWorld(this.getId()).then(world => {
      this._world = world;

      const nodesToLoad = world.nodes;
      _pender(nodesToLoad, (id, pend) => {
        const node = new Node({
          node: {
            id
          },
          world: this,
          db: this._db
        });
        node.load();
        node.on('ready', () => {
          this._world.nodes.push(node);

          pend();
        });
        node.on('error', err => {
          pend(err);
        });
      }, cb);
    }).catch(cb);
  }

  getProps() {
    return {
      world: this.getId()
    };
  }

  createNode(opts, cb) {
    const id = opts.id;
    const src = opts.src;
    const state = opts.state;

    const node = new Node({
      node: {
        id,
        src,
        state
      },
      world: this,
      db: this._db
    });
    this._world.nodes.push(id);

    this._db.setNode(node.toJSON()).then(newNode => {
      node._node = newNode;

      this._db.setWorld(this.toJSON()).then(world => {
        this._world = world;

        cb(null, node);
      }).catch(cb);
    }).catch(cb);
  }

  toJSON() {
    return this._world;
  }
}
Worlds.World = World;

class Node extends EventEmitter {
  constructor(opts) {
    super();

    this._node = opts.node;
    this._world = opts.world;
    this._db = opts.db;

    this.save = this.makeSave();
  }

  getId() {
    return this._node.id;
  }

  load() {
    const cb = err => {
      if (!err) {
        this.emit('ready');
      } else {
        this.emit('error', err);
      }
    };

    this._db.getNode(this.getId()).then(node => {
      this._node = node;

      this.boot();

      cb();
    }).catch(cb);
  }

  makeSave() {
    return _single(() => this._db.setNode(this.toJSON())); // XXX only save then there is a difference since the last save
  }

  boot() {
    this._instance = new NodeInstance({
      src: this._node.src,
      props: this._world.getProps(),
      state: this._node.state
    });
    this._instance.on('render', element => {
      this._world.emit('render', {
        node: this.getId(),
        html: _renderElement(element)
      });
    });
    this._instance.on('update', state => {
      this._node.state = state;

      this.save();
    });

    // XXX handle node death
  }

  toJSON() {
    return this._node;
  }
}
Worlds.Node = Node;

function _pender(a, handler, cb) {
  let pending = a.length, error = null;
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

  a.forEach(e => {
    handler(e, pend);
  });

  if (pending === 0) {
    process.nextTick(cb);
  }
}

module.exports = Worlds;
