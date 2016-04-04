"use strict";

const os = require('os');
const WorkerPool = require('node-worker-pool');

const jsUtils = require('../js-utils/index');
const database = require('../database/index');
const voxelWorker = require('../voxel-worker/index');

const NUM_CPUS = os.cpus().length;
const NODE_EXEC_PATH = process.execPath;

function World(worldname) {
  this._worldname = worldname;
}
World.prototype = {
  getChunk: function(opts, cb) {
    const worldname = this._worldname;
    const position = opts.position;

    const chunkSpec = {worldname, position};
    _getChunk(chunkSpec).then(chunk => {
      if (chunk) {
        cb(null, chunk);
      } else {
        _getWorld(worldname).then(world => {
          if (world) {
            const seed = world.seed;
            const generateChunkSpec = {seed, position};
            _generateChunk(generateChunkSpec).then(chunkData => {
              const voxels = chunkData.voxels;
              const depths = chunkData.depths;
              const vegetations = chunkData.vegetations;
              const entities = chunkData.entities;
              const weathers = chunkData.weathers;
              const effects = chunkData.effects;
              const setChunkSpec = {
                worldname,
                x,
                y,
                z,
                voxels,
                depths,
                vegetations,
                entities,
                weathers,
                effects,
              };
              _setChunk(setChunkSpec).then(() => {
                cb(null, chunk);
              }).catch(err => { cb(err); });
            }).catch(err => { cb(err); });
          } else {
            cb('no such world');
          }
        }).catch(err => { cb(err); });
      }
    }).catch(err => { cb(err); });
  },
  updateChunk: function(opts, cb) {

  },
};

function _getChunk(chunkSpec) {
  const worldname = chunkSpec.worldname;
  const position = chunkSpec.position;
  const x = position.x;
  const y = position.y;
  const z = position.z;

  return new Promise((accept, reject) => {
    database.get()
      .where('worldname', worldname)
      .where('x', x)
      .where('y', y)
      .where('z', z)
      .select(
        'voxels',
        'depths',
        'vegetations',
        'entities',
        'weathers',
        'effects'
      )
      .from('chunks')
      .then(chunks => {
        if (chunks.length > 0) {
          const chunk = chunks[0];
          accept(chunk);
        } else {
          accept(null);
        }
      });
  });
}

function _getWorld(worldname) {
  return new Promise((accept, reject) => {
    database.get().where('worldname', worldname).select('worldname', 'seed').from('worlds').then(worlds => {
      if (worlds.length > 0) {
        const world = worlds[0];
        accept(world);
      } else {
        accept(null);
      }
    });
  });
}

function _setChunk(setChunkSpec) {
  const worldname = setChunkSpec.worldname;
  const x = setChunkSpec.x;
  const y = setChunkSpec.y;
  const z = setChunkSpec.z;

  const voxels = setChunkSpec.voxels;
  const depths = setChunkSpec.depths;
  const vegetations = setChunkSpec.vegetations;
  const entities = setChunkSpec.entities;
  const weathers = setChunkSpec.weathers;
  const effects = setChunkSpec.effects;

  return new Promise((accept, reject) => {
    accept();
    /* const chunk = {
      // XXX figure out how to insert the data
    };
    database.get()('chunks').insert(chunk).then(() => { accept(); }).catch(reject); */
  });
}

function _generateChunk(generateChunkSpec) {
  return new Promise((accept, reject) => {
    console.log('generating chunk', {
      method: 'generateChunk',
      args: [generateChunkSpec]
    });

    _getVoxelWorkerPool().sendMessage({
      method: 'generateChunk',
      args: [generateChunkSpec]
    }).then(o => {
      const error = o.error;
      if (!error) {
        const result = o.result;
        const parsedResult = jsUtils.parseBinary(result);
        accept(parsedResult);
      } else {
        reject(error);
      }
    }).catch(reject);
  });
}

let voxelWorkerPool = null;
function _getVoxelWorkerPool() {
  if (voxelWorkerPool === null) {
    voxelWorkerPool = new WorkerPool(
      NUM_CPUS,
      NODE_EXEC_PATH,
      [voxelWorker.WORKER_SCRIPT_PATH],
      {
        initData: {}
      }
    );
  }
  return voxelWorkerPool;
}

const api = {
  getWorld: function(worldname) {
    return new World(worldname);
  },
};

module.exports = api;
