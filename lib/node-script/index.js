var jsbe = require('../jsbe');

function _makeGuid() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

function _decorateSrc(src) {
  var decoratedSrc = src + `
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
`;
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
  }
};

module.exports = NodeScript;
