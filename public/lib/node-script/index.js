import babel from '../../dist/babel-core/index';

class NodeScript {
  constructor(src) {
    this._src = src;
  }

  compile() {
    const result = babel.transform(this._src);
    const {code} = result;
    return code;
  }
}

export default NodeScript;
