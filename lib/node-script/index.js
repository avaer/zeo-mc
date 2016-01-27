var jsbe = require('../jsbe');

function NodeScript(src) {
  this._script = new jsbe.Script(src);
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

  emit: function(e, d) {
    this._script.emit(e, d);
  },

  destroy: function() {
    this._script.destroy();
  }
};

module.exports = {
  NodeScript: NodeScript
};
