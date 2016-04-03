(function() {
"use strict";

const database = require('../database/index');
const voxelTerrain = require('../../public/lib/voxel-terrain/index');

const constants = require('../../public/constants/index');
const CHUNK_SIZE = constants.CHUNK_SIZE;

function World(worldname) {
  this._worldname = worldname;
}
World.prototype = {
  getChunk: function(opts, cb) {
    const {_worldname: worldname} = this;
    const position = opts.position;
    const x = position[0];
    const y = position[1];
    const z = position[2];

    const chunkSpec = {worldname, x, y, z};
    _getChunk(chunkSpec).then(chunk => {
      if (chunk) {
        cb(null, chunk);
      } else {
        _getWorld(worldname).then(world => {
          if (world) {
            const seed = world.seed;
            const generateChunkSpec = {seed, position});
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
            reject(new Error('no such world'));
          }
        });
      }
    }).catch(err => { cb(err); });
  },
  updateChunk: function(opts, cb) {
  },
};

function _getChunk(chunkSpec) {
  const worldname = chunkSpec.worldname;
  const x = chunkSpec.x;
  const y = chunkSpec.y;
  const z = chunkSpec.z;

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
        'effects',
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
  const worldname = chunkSpec.worldname;

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
    const chunk = {
      // XXX figure out how to insert the data
    };
    database.get()('chunks').insert(chunk).then(() => { accept(); }).catch(reject);
  });
}

function _generateChunk(generateChunkSpec) {
  const seed = generateChunkSpec.seed;
  const position = generateChunkSpec.position;

  const voxelTerrainGenerate = voxelTerrain({
    seed,
    chunkSize: CHUNK_SIZE,
  });
  const chunk = voxelTerrainGenerate(position);
  return chunk;
}

const api = {
  world: function(worldname) {
    return new World(worldname);
  },
};

module.exports = api;

})();
