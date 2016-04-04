import configJson from '../../../config/index.json';

const {random} = Math;

export default class WorldConnection {
  constructor(worldname) {
    this._worldname = worldname;

    this._connection = null;
    this._connected = false;
    this._error = null;
    this._queue = [];

    this.init();
  }

  init() {
    const {_worldname: worldname} = this;

    const _resolveQueue = () => {
      for (let i = 0; i < this._queue.length; i++) {
        this._queue[i]();
      }
      this._queue = [];
    };

    _makeConnection(worldname).then(c => {
      this._connection = c;
      this._connected = true;

      _resolveQueue();
    }).catch(err => {
      this._connected = true;
      this._error = err;

      _resolveQueue();
    });
  }

  getChunk(chunkSpec, cb) {
    const _getChunk = cb => {
      const {_error: error} = this;
      if (!error) {
        const {_connection: connection} = this;
        connection.getChunk(chunkSpec, cb);
      } else {
        cb(err);
      }
    };

    if (this._connected) {
      _getChunk(cb);
    } else {
      this._queue.push(() => {
        _getChunk(cb);
      });
    }
  }
}

function _makeConnection(worldname) {
  return new Promise((accept, reject) => {
    const c = new WebSocket('wss://' + window.location.host + configJson.apiPrefix + '/stream/worlds/' + worldname);
    c.onopen = () => {
      accept(c);
    };
    c.onerror = err => {
      reject(err);
    };

    c.write = _connectionWrite;
    c.read = _connectionRead;
    _bindCall(c);

    c.getChunk = function(chunkSpec, cb) {
      this.call('getChunk', chunkSpec, cb);
    };
  });
}

function _connectionWrite(event, data) {
  const o = {event, data};
  const s = JSON.stringify(o);
  this.send(s);
}

function _connectionRead(fn) {
  this.onmessage = m => {
    const {data} = m;
    const o = _jsonParse(data);
    if (o && typeof o === 'object') {
      const {event, data} = o;
      if (typeof event === 'string' && typeof data !== 'undefined') {
        fn(event, data);
      } else {
        this.close();
      }
    } else {
      this.close();
    }
  };
}

function _bindCall(c) {
  const _cbs = new Map();

  c.call = (method, args, cb) => {
    const id = _makeId();
    _cbs.set(id, cb);

    c.write('request', {
      id,
      method,
      args,
    });
  };
  c.read((event, data) => {
    if (event === 'response') {
      const {id} = data;
      const cb = _cbs.get(id);
      if (cb) {
        const {args} = data;
        const {error} = data;
        if (!error) {
          const {result} = data;
          cb(null, result);
        } else {
          cb(error);
        }

        _cbs.delete(id);
      } else {
        c.close();
      }
    } else {
      c.close();
    }
  });
}

function _makeId() {
  return random().toString(36).substring(7);
}

function _jsonParse(s) {
  let result, error = null;
  try {
    result = JSON.parse(s);
  } catch(err) {
    error = err;
  }
  if (!error) {
    return result;
  } else {
    return null;
  }
}

// XXX
// c = new WorldConnection('lol'); c.getChunk({position: [0,0,0]}, (err, result) => { console.log({err, result}); });
