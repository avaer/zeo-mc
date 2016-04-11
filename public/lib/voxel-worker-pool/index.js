import {CHUNK_SIZE} from '../constants/index';

export default class VoxelWorkerPool {
  constructor({workerOpts, numWorkers}) {
    this._workers = this._makeWorkers(workerOpts, numWorkers);
    this._workerIndex = 0;
    this._pendingGenerates = new Map();
  }

  _makeWorkers(workerOpts, numWorkers) {
    const workers = [];
    for (let i = 0; i < numWorkers; i++) {
      (() => {
        const worker = new Worker('/static/voxel-worker.js');
        worker.call = (method, args, cb) => {
          const type = 'request';
          worker.postMessage({type, method, args});
          cbs.push(cb);
        };
        worker.init = () => {
          worker.call('init', [workerOpts], err => {
            if (err) {
              console.warn(err);
            } else {
              // nothing
            }
          });
        };
        const cbs = [];
        worker.onmessage = resMsg => {
          const {data: res} = resMsg;
          const {type} = res;
          if (type === 'response') {
            const cb = cbs.shift();

            const {error} = res;
            if (!error) {
              const {result} = res;
              cb(null, result);
            } else {
              cb(error);
            }
          } else if (type === 'log') {
            const {log} = res;
            console.log(log);
          }
        };
        worker.onerror, err => {
          console.warn('worker error', err);
        };

        worker.init();

        workers.push(worker);
      })();
    }
    return workers;
  }

  _callWorker(method, args, cb) {
    const workerIndex = this._workerIndex;
    const worker = this._workers[workerIndex];
    this._workerIndex = (workerIndex + 1) % this._workers.length;

    worker.call(method, args, cb);
  }

  generateAsync(position, cb) {
    const positionKey = _positionKey(position);
    let cbs = this._pendingGenerates.get(positionKey);
    if (!cbs) {
      cbs = [];
      this._pendingGenerates.set(positionKey, cbs)

      this._callWorker('generate', [position], (err, chunk) => {
        this._pendingGenerates.delete(positionKey);

        if (!err) {
          cbs.forEach(cb => {
            cb(chunk);
          });
        } else {
          console.warn(err);
        }
      });
    }
    cbs.push(cb);
  }
}
