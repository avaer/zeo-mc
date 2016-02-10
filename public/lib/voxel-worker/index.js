import * as voxelAsync from '../voxel-async/index';

console = {
  log: (...args) => {
    let s = '';
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (s) {
        s += ' ';
      }
      if (typeof arg === 'string') {
        s += arg;
      } else if (arg instanceof Error) {
        s += arg.stack;
      } else {
        s += JSON.stringify(arg, null, 2);
      }
    }

    const msg = {
      type: 'log',
      log: s
    };
    postMessage(msg);
  }
};

onmessage = reqMsg => {
  function done(error, result) {
    const type = 'response';
    const res = {
      type,
      error,
      result
    };
    postMessage(res);
  }

  _tryCatch(() => {
    const {data: req} = reqMsg;
    const {type} = req;
    if (type === 'request') {
      const {method, args} = req;

      switch (method) {
        case 'init': return init(args[0] || null);
        case 'generate': return generate(args[0] || null);
        default: throw new Error('ENOENT');
      }
    }
  }, done);
};

function init(opts) {
  return voxelAsync.init(opts);
}

function generate(position) {
  return voxelAsync.generateSync(position);
}

function _tryCatch(fn, cb) {
  let result, error = null;
  try {
    result = fn();
  } catch(err) {
    error = err;
  }
  if (!error) {
    cb(null, result);
  } else {
    if (error instanceof Error) {
      error = error.stack;
    }
    cb(error);
  }
}
