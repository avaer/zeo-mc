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
  const {render} = exports;

  exports._render = function() {
    if (typeof render === 'function') {
      return render.apply(null, arguments);
    } else {
      return <div/>;
    }
  };
}

((on, once, off, emit) => {
  on('call', ({id, name, args}) => {
    const fn = exports ? exports[name] : null;
    const cb = (error, result) => {
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
        if (!(result instanceof ReactElement)) {
          result = <div/>;
        }
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

function NodeScript(src) {
  var decoratedSrc = _decorateSrc(src);
  this._script = new jsbe.Script(decoratedSrc);
}
NodeScript.prototype = {
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
    this._script.once(e, handler);
  },

  emit: function(e, d) {
    this._script.emit(e, d);
  },

  destroy: function() {
    this._script.destroy();
  },

  call: function(name, args, cb) {
    var id = _makeGuid();
    this._script.emit('call', {
      id: id,
      name: name,
      args: args
    });
    this._script.once('callback.' + id, function(o) {
      var error = o.error;
      var result = o.result;
      cb(error, result);
    });
  },

  render: function(args, cb) {
    this.call('_render', args, cb);
  }
};

module.exports = NodeScript;
