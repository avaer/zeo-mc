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

const api = {
  ok,
  error
};

module.exports = api;
