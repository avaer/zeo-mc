var WORKER_HEADER = '(' + (function() {
  var _postMessage = window.postMessage;
  delete window.postMessage;

  var _cbs = {};
  window.on = function(e, cb) {
    var l = cbs[e];
    if (!l) {
      l = [];
      cbs[e] = l;
    }
    l.push(cb);
  };
  window.off = function(e, cb) {
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
  window.emit = function(e, d) {
    var msg = {
      type: e,
      data: d
    };
    _postMessage(msg);
  };

  window.onmessage = function(m) {
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
}).toString() + ')();\n';

function Script(src) {
  this.src = src;

  this._worker = null;
}
Script.prototype = {
  start: function() {
    function makeWorker(src) {
      var src = WORKER_HEADER + this.src;
      var blob = new Blob([src], {type: 'application/javascript'});

      var worker = new Worker(blob);
      var cbs = {};
      worker._cbs = cbs;
      worker.onmessage = function(e) {
        var msg = e.data;
        var e = msg.type;
        var data = msg.data;

        var l = cbs[e];
        if (l) {
          for (var i = 0; i < l.length; i++) {
            var cb = l[i];
            cb(data);
          }
        }
      };

      return worker;
    }

    if (!this._worker) {
      this._worker = makeWorker(this.src);
    }
  },
  kill: function() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
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
  on: function(e, d) {
    if (this._worker) {
      var cbs = this._worker._cbs;
      var l = cbs[e];
      if (!l) {
        l = [];
        cbs[e] = l;
      }
      l.push(cb);
    }
  },
  off: function(e, cb) {
    if (this._worker) {
      var cbs = this._worker._cbs;
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
  }
};

var jsfe = {
  Script: Script
};

module.exports = jsfe;
