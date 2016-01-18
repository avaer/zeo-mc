var child_process = require('child_process');

function makeChildProcess(src) {
  var childProcess = child_process.fork('./lib/stub.js');
  childProcess.send({
    type: 'script',
    data: src
  });
  childProcess._cbs = {};

  return childProcess;
}

function Script(src) {
  this.src = src;

  this._childProcess = null;
}
Script.prototype = {
  start: function() {
    if (!this._childProcess) {
      var childProcess = makeChildProcess(src);

      this._childProcess = childProcess;
    }
  },
  kill: function() {
    if (this._childProcess) {
      this._childProcess.kill('SIGKILL');
      this._childProcess = null;
    }
  },
  on: function(e, cb) {
    if (this._childProcess) {
      var _cbs = this._childProcess._cbs;
      var l = _cbs[e];
      if (!l) {
        l = [];
        _cbs[e] = l;
      }
    }
  },
  emit: function(e, d) {
    if (this._childProcess) {
      var msg = {
        type: 'event',
        event: e,
        data: d
      };
      this._childProcess.postMessage(msg);
    }
  },
  off: function(e, cb) {
    if (this._childProcess) {
      var _cbs = this._childProcess._cbs;
      var l = _cbs[e];
      if (l) {
        if (typeof cb === 'undefined') {
          _cbs[e] = [];
        } else {
          var index = _cbs.indexOf(e);
          if (~index) {
            _cbs.splice(index, 1);
          }
        }
      }
    }
  }
}

var jsbe = {
  Script: Script
};

module.exports = jsbe;
