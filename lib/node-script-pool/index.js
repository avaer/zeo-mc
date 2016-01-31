const child_process = require('child_process');

class NodePool {
  constructor() {
    this._pool = new Map();
  }

  getNodeScript(id) {
    return this._pool.get(id);
  }

  setNodeScript(id, nodeScript) {
    return this._pool.set(id, nodeScript);
  }
}

module.exports = NodePool;
