import babel from '../../dist/babel-core/index';

import jsfe from '../jsfe/index';

const BABEL_OPTIONS = {
};

class NodeScript {
  constructor(src) {
    this._src = src;
    this._compiledSrc = this.compile();
    this._script = new jsfe.Script(this._compiledSrc);
  }

  compile() {
    const result = babel.transform(this._src, BABEL_OPTIONS);
    const {code} = result;
// XXX include React helpers here
    return code;
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
}

NodeScript.test = () => {
  const s = new NodeScript('on("frame", frameData => { emit("render", frameData); });');
  s.start();
  s.on('render', d => {
    console.log('got render', d);
    s.kill();
    s.emit('frame', {lol: 'zol'});
  });
  s.emit('frame', {lol: 'zol'});
};

export default NodeScript;
