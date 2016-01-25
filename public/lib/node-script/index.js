import babel from '../../dist/babel-core/index';

import jsfe from '../jsfe/index';

const BABEL_OPTIONS = {
};

function _compileSrc(src) {
  const result = babel.transform(src, BABEL_OPTIONS);
  const {code} = result;
  return code;
}

class NodeScript {
  constructor(src) {
    const compiledSrc = _compileSrc(src);
    this._script = new jsfe.Script(compiledSrc);
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

NodeScript.test = () => {
  const s = new NodeScript('on("frame", frameData => { emit("render", frameData); });');
  s.start();
  s.on('render', d => {
    console.log('got render', d);
    s.kill();
    s.emit('frame', {lol: 'zol'});
    s.destroy();
  });
  s.emit('frame', {lol: 'zol'});
};

export default NodeScript;
