var path = require('path');
var child_process = require('child_process');
var babel = require('../../public/dist/babel-core/index');

var BABEL_OPTIONS = {
};

function _wrapExports(src) {
  return '"use strict";\nlet exports = {};\n' + src;
}

function _compileSrc(src) {
  var result, error = null;
  try {
    result = babel.transform(src, BABEL_OPTIONS);
  } catch(err) {
    error = err;
  }
  var code = !error ? _wrapExports(result.code) : null;
  return {error: error, code: code};
}

function Script(src) {
  var compiledSrc = _compileSrc(src);
  this._src = compiledSrc.code;
  this._error = compiledSrc.error;

  this._childProcess = null;
  this._cbs = {};
}
Script.prototype = {
  start: function() {
    var handle = this.handle.bind(this);

    function _makeChildProcess(src) {
      var childProcess = child_process.fork(path.join(__dirname, 'lib', 'stub.js'));
      childProcess.send({
        type: 'script',
        data: src
      });
      childProcess.on('message', function(msg) {
        var t = msg.type;
        if (t === 'event') {
          var e = msg.event;
          var d = msg.data;

          handle(e, d);
        }
      });

      return childProcess;
    }

    if (!this._childProcess) {
      var error = this._error;

      if (!error) {
        var src = this._src;
        var childProcess = _makeChildProcess(src);

        this._childProcess = childProcess;
      } else {
        process.nextTick(function() {
          handle('error', error);
        });
      }
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
  },
  once: function(e, cb) {
    function on() {
      off();

      cb.apply(this, arguments);
    }

    function off() {
      var index = l.indexOf(on);
      if (~index) {
        l.splice(index, 1);
      }
    }

    var cbs = this._cbs;
    var l = cbs[e];
    if (!l) {
      l = [];
      cbs[e] = l;
    }
    l.push(on);
  },
  emit: function(e, d) {
    if (this._childProcess) {
      var msg = {
        type: 'event',
        event: e,
        data: d
      };
      this._childProcess.send(msg);
    }
  },
  handle: function(e, d) {
    var cbs = this._cbs;
    var l = cbs[e];
    if (l) {
      for (var i = 0; i < l.length; i++) {
        var cb = l[i];
        cb(d);
      }
    }
  }
}

var jsbe = {
  Script: Script
};

module.exports = jsbe;
