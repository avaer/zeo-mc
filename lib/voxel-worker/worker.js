(function() {
"use strict";

const workerUtils = require('node-worker-pool/nodeWorkerUtils');

const jsUtils = require('../js-utils/index');
const voxelTerrain = require('../../public/lib/voxel-terrain/index');
const constants = require('../../constants/index');
const CHUNK_SIZE = constants.CHUNK_SIZE;

let initData;
function onInitialize(data) {
  initData = data;
}

function onMessage(data) {
  const method = data.method;
  const args = data.args;

  const handler = handlers[method];
  if (handler) {
    const o = _callHandler(handler, args);
    return o;
  } else {
    const error = 'no such handler';
    return {error};
  }
}

const handlers = {
  generateChunk: function(generateChunkSpec) {
    const seed = generateChunkSpec.seed;
    const position = generateChunkSpec.position;

    const voxelTerrainGenerate = voxelTerrain({
      seed,
      chunkSize: CHUNK_SIZE,
    });
    const chunk = voxelTerrainGenerate(position);
    return chunk;
  },
};

function _callHandler(handler, args) {
  let result, error = null;
  try {
    result = handler.apply(null, args);
  } catch(err) {
    error = err;
  }
  if (!error) {
    result = jsUtils.formatBinary(result);
    return {result};
  } else {
    return {error};
  }
}

if (require.main === module) {
  try {
    workerUtils.startWorker(onInitialize, onMessage);
  } catch (e) {
    workerUtils.respondWithError(e);
  }
}

})();
