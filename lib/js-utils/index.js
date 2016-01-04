function ok(okHandler, failHandler) {
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

function parallel() {
  // XXX
}

const api = {
  ok,
  error,
  extend,
  jsonParse,
  parallel
};

module.exports = api;
