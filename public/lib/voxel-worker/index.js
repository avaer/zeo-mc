import * as voxelAsync from '../voxel-async/index';

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
        case 'generate': return generate(args[0] || null);
        default: throw new Error('ENOENT');
      }
    }
 }, done);
};

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
    cb(error);
  }
}
