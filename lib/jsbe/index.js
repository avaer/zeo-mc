var child_process = require('child_process');
var babel = require('../../public/dist/babel-core/index');

var BABEL_OPTIONS = {
};

function _compileSrc(src) {
  var result, error = null;
  try {
    result = babel.transform(src, BABEL_OPTIONS);
  } catch(err) {
    error = err;
  }
  var code = !error ? result.code : null;
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
    var cbs = this._cbs;

    function makeChildProcess(src) {
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

          handleMessage(e, d);
        }
      });

      return childProcess;
    }

    function handleMessage(e, d) {
      var l = cbs[e];
      if (l) {
        l.forEach(function(cb) {
          cb(d);
        });
      }
    }

    if (!this._childProcess) {
      var error = this._error;

      if (!error) {
        var src = this._src;
        var childProcess = makeChildProcess(src);

        this._childProcess = childProcess;
      } else {
        process.nextTick(function() {
          handleMessage('error', error);
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
