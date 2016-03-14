import Immutable from 'immutable';

class Engines {
  constructor(opts) {
    this._opts = opts;

    this._engines = (() => {
      const result = {};
      ENGINES.forEach(Engine => {
        const engine = new Engine({
          getState: name => this.getState(name),
          setState: (name, state) => {
            this.setState(name, state);
          },
          updateState: (name, fn) => {
            this.updateState(name, fn);
          }
        });
        const {NAME: name} = Engine;
        result[name] = engine;
      });
      return result;
    })();

    this.init();
  }

  getEngine(name) {
    return this._engines[name] || null;
  }

  getState(name) {
    return this._opts.getState(name);
  }

  setState(name, newState) {
    return this._opts.setState(name, newState);
  }

  updateState(name, fn) {
    const oldState = this.getState(name);
    const newState = fn(oldState);
    this.setState(name, newState);
  }

  init() {
    for (let engineName in this._engines) {
      const engine = this._engines[engineName];
      const states = engine.init();
      if (states !== null) {
        for (let storeName in states) {
          const state = states[storeName];
          this.setState(storeName, state);
        }
      }
    }
  }
}

class Engine {
  constructor(opts) {
    this._opts = opts;

    this.listen();
  }

  getState(name) {
    return this._opts.getState(name);
  }

  setState(name, newState) {
    this._opts.setState(name, newState);
  }

  updateState(name, fn) {
    this._opts.updateState(name, fn);
  }

  init() {
    return null;
  }

  listen() {
    // nothing
  }
};
Engines.Engine = Engine;

module.exports = Engines;

const Window = require('./window');
const Menu = require('./menu');
const Player = require('./player');

const ENGINES = [
  Window,
  Menu,
  Player,
];
