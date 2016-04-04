"use strict";

const ERROR_STATUS_CODES = {
  'ENOENT': 404,
  'EAUTH': 403
};

function ok(failHandler, okHandler) {
  if (okHandler === undefined) {
    okHandler = failHandler;
    failHandler = err => {
      throw err;
    };
  }

  return function(err, result) {
    if (!err) {
      okHandler(result);
    } else {
      failHandler(err);
    }
  };
}

function error(code, msg) {
  const error = new Error(msg);
  error.code = code;
  return error;
}

function extend(a, b) {
  const result = {};
  [a, b].forEach(o => {
    for (let k in o) {
      result[k] = o[k];
    }
  });
  return result;
}

function jsonParse(s) {
  let err = null, result;

  try {
    result = JSON.parse(s);
  } catch(e) {
    err = e;
  }

  if (!err) {
    return result;
  } else {
    return null;
  }
}

function find(a, predicate) {
  let result;

  if (a.some(e => {
    if (predicate(e)) {
      result = e;

      return true;
    } else {
      return false;
    }
  })) {
    return result;
  } else {
    return void 0;
  }
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function shallow(o) {
  const result = {};
  for (var k in o) {
    result[k] = o[k];
  }
  return result;
}

function flatten(as) {
  const result = [];
  as.forEach(a => {
    result.push.apply(result, a);
  });
  return result;
}

function resErr(res) {
  return function(err) {
    if (!err) {
      res.send();
    } else {
      const code = err.code || null;
      const statusCode = ERROR_STATUS_CODES[code] || 500;
      res.send(statusCode);
    }
  };
}

function parallel() {
  const allCbs = Array.prototype.slice.apply(arguments);
  const cbs = allCbs.slice(0, -1);
  const cb = allCbs.slice(-1)[0];

  let pending = cbs.length, err = null, results = Array(cbs.length);
  function done(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, results);
    }
  }
  function pend() {	
    if (--pending === 0) {
      done(err, results);
    }
  }
  function makePend(i) {
    return function(e, result) {
      if (!e) {
        results[i] = result;
      } else {
        if (!err) {
          err = e;
        }
      }

      pend();
    };
  }

  if (cbs.length > 0) {
    cbs.forEach((cb, i) => {
      cb(makePend(i));
    });
  } else {
    done(null, []);
  }
}

function formatBinary(o) {
  const result = {};
  for (let k in o) {
    const value = o[k];

    const setValue = (type, value) => {
      result[k] = {type, value};
    };

    if (value) {
      if (value instanceof Int16Array) {
        setValue('Int16Array', new Buffer(value.buffer).toString('base64'));
      } else if (value instanceof Float32Array) {
        setValue('Float32Array', new Buffer(value.buffer).toString('base64'));
      } else {
        setValue('json', value);
      }
    } else {
      setValue('json', value);
    }
  }
  return result;
}

function parseBinary(o) {
  const result = {};
  for (let k in o) {
    const spec = o[k];

    const value = (() => {
      switch (spec.type) {
        case 'Int16Array': return new Int16Array(new Buffer(spec.value, 'base64').buffer);
        case 'Float32Array': return new Float32Array(new Buffer(spec.value, 'base64').buffer);
        default: return spec.value;
      }
    })();
    result[k] = value;
  }
  return result;
}

const api = {
  ok,
  error,
  extend,
  jsonParse,
  find,
  clone,
  shallow,
  flatten,
  resErr,
  parallel,
  formatBinary,
  parseBinary,
};

module.exports = api;
