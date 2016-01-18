var vm = require('vm');

var sync = require('synchronize');

function run(src) {
  sync.fiber(function() {
    var script = new vm.Script(src);
    script.runInNewContext([on, emit, off], {
      fileName: 'script.js'
    });
  });
}

var _cbs = {};
function handle(e, d) {
  var l = _cbs[e];
  if (l) {
    for (var i = 0; i < l.length; i++) {
      var cb = l[i];
      cb(d);
    }
  }
}

function on(e, cb) {
  var l = _cbs[e];
  if (!l) {
    l = [];
    _cbs[e] = l;
  }
  l.push(cb);
}

function emit(e, d) {
  var msg = {
    type: 'event',
    event: e,
    data: d
  };
  process.send(msg);
}

function off(e, cb) {
  var l = _cbs[e];
  if (l) {
    if (typeof cb === 'undefined') {
      _cbs[e] = [];
    } else {
      var index = _cbs.indexOf(cb);
      if (~index) {
        _cbs.splice(index, 1);
      }
    }
  }
}

process.on('message', function(msg) {
  var type = msg.type;
  var data = msg.data;

  if (type === 'script') {
    run(data);
  } else if (type === 'event') {
    var event = m.event;
    handle(event, data);
  }
});
