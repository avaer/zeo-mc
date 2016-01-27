var child_process = require('child_process');

function makeChildProcess(src, cbs) {
  var childProcess = child_process.fork('./lib/stub.js');
  childProcess.send({
    type: 'script',
    data: src
  });
  childProcess.on('message', function(msg) {
    var t = msg.type;
    if (t === 'event') {
      var e = msg.event;
      var d = msg.data;

      var l = cbs[e];
      if (l) {
        l.forEach(function(cb) {
          cb(d);
        });
      }
    }
  });

  return childProcess;
}

function Script(src) {
  this._src = src;

  this._childProcess = null;
  this._cbs = {};
}
Script.prototype = {
  start: function() {
    if (!this._childProcess) {
      var src = this._src;
      var cbs = this._cbs;
      var childProcess = makeChildProcess(src, cbs);

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
    var cbs = this._cbs;
    var l = cbs[e];
    if (!l) {
      l = [];
      cbs[e] = l;
    }
    l.push(cb);
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
    var cbs = this._cbs;
    var l = cbs[e];
    if (l) {
      if (typeof cb === 'undefined') {
        cbs[e] = [];
      } else {
        var index = cbs.indexOf(e);
        if (~index) {
          cbs.splice(index, 1);
        }
      }
    }
  }
}

var jsbe = {
  Script: Script
};

module.exports = jsbe;
