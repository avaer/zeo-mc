var Immutable = require('immutable');

var jsbe = require('../jsbe');

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

if (exports) {
  const {render, update} = exports;

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
  exports._update = function(self, nextProps, nextState) {
    if (typeof update === 'function') {
      const result = update.call(self, nextProps, nextState);

      if (typeof result === 'object' && result !== null) {
        return result;
      } else {
        throw new Error('update() must return a JS object');
      }
    } else {
      return null;
    }
  };
}

((on, once, off, emit) => {
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

  init() {
    this.refresh();
  },

  call: function(name, args, cb) {
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
        cb(result);
      } else {
        this.handle('error', error);
      }
    });
  },

  onupdate: function(newState) {
    this._oldState = this._state;
    this._state = Immutable.fromJS(newState);
    this.handle('update', newState);
  },

  onrender: function(result) {
    this.handle('render', result);
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
