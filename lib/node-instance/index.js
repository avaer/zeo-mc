const Immutable = require('immutable');

const jsbe = require('../jsbe');

function _makeGuid() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

const SRC_PREFIX = `
function _isObject(o) {
  return typeof o === 'object' && o !== null && !Array.isArray(o);
}

class ReactElement {
  constructor(type, props, children) {
    this.type = (typeof type === 'string') ? type : 'div';
    this.props = (_isObject(props)) ? props : {};
    this.children = ((Array.isArray(children) && children.every(child => child instanceof ReactElement)) || typeof children === 'string') ? children : [];
  }

  toJSON() {
    const {type, props, children} = this;
    return {type, props, children};
  }
}

const React = {
  createElement: function(type, props, children) {
    return new ReactElement(type, props, children);
  }
};

((on, once, off, emit) => {
  function _makeUpdate(fnName, handler) {
    return function() {
      if (typeof handler === 'function') {
        const self = arguments[0];
        const args = Array.prototype.slice.call(arguments, 1);
        const result = handler.apply(self, args);

        if (typeof result === 'object' && result !== null) {
          return result;
        } else {
          throw new Error(fnName + '() must return a JS object');
        }
      } else {
        return null;
      }
    };
  }

  if (exports) {
    const {init, render, update} = exports;

    exports._render = function(self) {
      if (typeof render === 'function') {
        const result = render.call(self);

        if (result) {
          if (result instanceof ReactElement) {
            return result;
          } else {
            throw new Error('render() must return a React element');
          }
        } else {
          return null;
        }
      } else {
        return <div/>;
      }
    };
    exports._init = _makeUpdate('init', init);
    exports._update = _makeUpdate('update', update);
  }

  on('call', ({id, name, args}) => {
    const fn = exports ? exports[name] : null;
    const cb = (error, result) => {
      if (error instanceof Error) {
        error = error.stack;
      }
      emit('callback.' + id, {error, result});
    };
    if (fn) {
      let result, error = null;
      try {
        result = fn.apply(null, args);
      } catch(err) {
        error = err;
      }
      if (!error) {
        cb(null, result);
      } else {
        cb(error);
      }
    } else {
      const error = {
        code: 'ENOENT'
      };
      const result = null;
      cb(error, result);
    }
  });
})(on, once, off, emit);

let on = void 0;
let once = void 0;
let off = void 0;
let emit = void 0;
`;

function _decorateSrc(src) {
  var decoratedSrc = SRC_PREFIX + src;
  return decoratedSrc;
}

function _noop() {}

function NodeInstance(opts) {
  opts = opts || {};
  opts.src = opts.src || '';
  opts.props = opts.props || {};
  opts.state = opts.state || {};

  var decoratedSrc = _decorateSrc(opts.src);
  this._script = new jsbe.Script(decoratedSrc);
  this._props = Immutable.fromJS(opts.props);
  this._state = Immutable.fromJS(opts.state);

  this._oldProps = this._props;
  this._oldState = this._state;

  this.listen();
}
NodeInstance.prototype = {
  start: function() {
    this._script.start();

    this.init(() => {
      this.render();
    });
  },

  kill: function() {
    this._script.kill();
  },

  on: function(e, cb) {
    this._script.on(e, cb);
  },

  off: function(e, cb) {
    this._script.off(e, cb);
  },

  once: function(e, cb) {
    this._script.once(e, cb);
  },

  emit: function(e, d) {
    this._script.emit(e, d);
  },

  handle: function(e, d) {
    this._script.handle(e, d);
  },

  listen() {
    this._script.on('_update', o => {
      this.onupdate(o);
    });
  },

  call: function(name, args, okCb, failCb) {
    okCb = okCb || _noop;
    failCb = failCb || (err => {
      this.onerror(err);
    });

    const id = _makeGuid();
    this._script.emit('call', {
      id: id,
      name: name,
      args: args
    });
    this._script.once('callback.' + id, o => {
      const error = o.error;
      if (!error) {
        const result = o.result;
        okCb(result);
      } else {
        failCb(error);
      }
    });
  },

  onerror: function(err) {
    this.handle('error', err);
  },

  oninit: function(newState) {
    this.onupdate(newState);
  },

  onupdate: function(newState) {
    if (newState !== null) {
      this._oldState = this._state;
      this._state = Immutable.fromJS(newState);
      this.handle('update', newState);
    }
  },

  onrender: function(result) {
    this.handle('render', result);
  },

  init(cb) {
    cb = cb || _noop;

    const args = [{
      props: this._props.toJS(),
      state: this._state.toJS()
    }];
    this.call('_init', args, result => {
      this.oninit(result);

      cb();
    }, err => {
      this.onerror(err);

      cb();
    });
  },

  update: function() {
    const args = [{
      props: this._oldProps.toJS(),
      state: this._oldState.toJS()
    }, this._props.toJS(), this._state.toJS()];
    this.call('_update', args, result => {
      this.onupdate(result);
    });
  },

  render: function() {
    const args = [{
      props: this._props.toJS(),
      state: this._state.toJS()
    }];
    this.call('_render', args, result => {
       this.onrender(result);
    });
  },

  refresh() {
    this.update();
    this.render();
  },

  setProps: function(newProps) {
    this._oldProps = this._props;
    this._props = newProps;
    this.refresh();
  }
};

module.exports = NodeInstance;
