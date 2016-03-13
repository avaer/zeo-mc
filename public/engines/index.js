import Immutable from 'immutable';

class Engines {
  constructor(opts) {
    this._opts = opts;

    this._engines = ENGINES.map(Engine => new Engine({
      getState: name => this.getState(name),
      setState: (name, state) => {
        this.setState(name, state);
      },
      updateState: (name, fn) => {
        this.updateState(name, fn);
      }
    }));

    this.init();
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
    this._engines.forEach(engine => {
      const states = engine.init();
      if (states !== null) {
        for (let name in states) {
          const state = states[name];
          this.setState(name, state);
        }
      }
    });
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

const ENGINES = [
  Window,
  Menu,
];
