var URL = window.URL || window.webkitURL;

var FUNCTION_PREFIX = '(function() {\n';
var FUNCTION_SUFFIX = '\n})();\n';

function _wrapFunction(src) {
  return FUNCTION_PREFIX + src + FUNCTION_SUFFIX;
}

var WORKER_HEADER = '"use strict";\n' + _wrapFunction(`
  var _postMessage = self.postMessage;
  delete self.postMessage;

  var _cbs = {};
  var on = function(e, cb) {
    var l = _cbs[e];
    if (!l) {
      l = [];
      _cbs[e] = l;
    }
    l.push(cb);
  };
  self.on = on;
  var off = function(e, cb) {
    var l = _cbs[e];
    if (l) {
      if (typeof cb === 'undefined') {
        _cbs[e] = [];
      } else {
        var index = l.indexOf(cb);
        if (~index) {
          l.splice(index, 1);
        }
      }
    }
  };
  self.off = off;
  var emit = function(e, d) {
    var msg = {
      type: e,
      data: d
    };
    _postMessage(msg);
  };
  self.emit = emit;

  var onmessage = function(m) {
    var msg = m.data;
    var e = msg.type;
    var data = msg.data;

    var l = _cbs[e];
    if (l) {
      for (var i = 0; i < l.length; i++) {
        var cb = l[i];
        cb(data);
      }
    }
  };
  self.onmessage = onmessage;

  var console = {};
  console.log = function() {
    var s = '';
    for (var i = 0; i < arguments.length; i++) {
      var a = arguments[i];
      if (typeof a === 'object') {
        a = JSON.stringify(a, null, 2);
      } else {
        a = String(a);
      }
      s += a;
      if (i !== arguments.length - 1) {
        s += ' ';
      }
    }
    s += '\\n';
    emit('console', s);
  };
  self.console = console;

  self.exports = {};
`);

function _makeUrl(src) {
  var prefixedSrc = WORKER_HEADER + _wrapFunction(src);
  var blob = new Blob([prefixedSrc], {type: 'application/javascript'});
  var url = URL.createObjectURL(blob);
  return url;
}

function _makeWorker(url, cbs) {
  function _handleMessage(e, d) {
    var l = cbs[e];
    if (l) {
      for (var i = 0; i < l.length; i++) {
      var cb = l[i];
        cb(d);
      }
    }
  }

  var worker = new Worker(url);
  worker.onmessage = function(event) {
    var msg = event.data;
    var e = msg.type;
    var d = msg.data;

    _handleMessage(e, d);
  };
  worker.onerror = function(error) {
    _handleMessage('error', error);
  };

  return worker;
}

function Script(src) {
  this._url = _makeUrl(src);
  this._cbs = {};
  this._worker = null;
}
Script.prototype = {
  start: function() {
    if (!this._worker) {
      this._worker = _makeWorker(this._url, this._cbs);
    }
  },
  kill: function() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  },
  destroy: function() {
    if (this._url) {
      URL.revokeObjectURL(this._url);
      this._url = null;
    }
  },
  emit: function(e, d) {
    if (this._worker) {
      var msg = {
        type: e,
        data: d
      };
      this._worker.postMessage(msg);
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
        var index = l.indexOf(cb);
        if (~index) {
          l.splice(index, 1);
        }
      }
    }
  }
};

var jsfe = {
  Script: Script
};

module.exports = jsfe;
