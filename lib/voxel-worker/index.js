"use strict";

const path = require('path');

const voxelTerrain = require('../voxel-terrain/index');
const constants = require('../../constants/index');
const CHUNK_SIZE = constants.CHUNK_SIZE;

const WORKER_SCRIPT_PATH = path.join(__dirname, 'worker.js');

const api = {
  getChunkSync: function(chunkSpec) {
    const seed = chunkSpec.seed;
    const position = chunkSpec.position;

    const voxelTerrainGenerate = voxelTerrain({
      seed,
      chunkSize: CHUNK_SIZE,
    });
    const chunk = voxelTerrainGenerate(position);
    return chunk;
  },
  getChunkAsync: function(chunkSpec, cb) {
    _getVoxelWorkerPool().sendMessage({
      method: 'generateChunk',
      args: [generateChunkSpec]
    }).then(o => {
      const error = o.error;
      if (!error) {
        const result = o.result;
        const parsedResult = jsUtils.parseBinary(result);
        cb(null, parsedResult);
      } else {
        cbb(error);
      }
    }).catch(err => { cb(err); });
  },
};

module.exports = api;

let voxelWorkerPool = null;
function _getVoxelWorkerPool() {
  if (voxelWorkerPool === null) {
    voxelWorkerPool = new WorkerPool(
      NUM_CPUS,
      NODE_EXEC_PATH,
      [WORKER_SCRIPT_PATH],
      {
        initData: {}
      }
    );
  }
  return voxelWorkerPool;
}
