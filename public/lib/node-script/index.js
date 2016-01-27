import jsfe from '../jsfe/index';

class NodeScript {
  constructor(src) {
    this._script = new jsfe.Script(src);
  }

  start() {
    this._script.start();
  }

  kill() {
    this._script.kill();
  }

  on(e, cb) {
    this._script.on(e, cb);
  }

  off(e, cb) {
    this._script.off(e, cb);
  }

  emit(e, d) {
    this._script.emit(e, d);
  }

  destroy() {
    this._script.destroy();
  }
}

export default NodeScript;
