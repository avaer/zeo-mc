import voxelTerrain from '../voxel-terrain/index';
import voxelMesher from '../voxel-mesher/index';

import {BLOCKS, MODELS} from '../../resources/index';

let voxelTerrainGenerate = null;
let voxelMesherMesh = null;

export function init({seed, chunkSize}) {
  voxelTerrainGenerate = voxelTerrain({seed, chunkSize});

  const transparentTypes = (() => {
    const result = {};
    BLOCKS.TRANSPARENT.forEach(t => {
      const index = BLOCKS.BLOCKS[t];
      result[index] = true;
    });
    return result;
  })();
  const mesherExtraData = {transparentTypes};
  voxelMesherMesh = voxelMesher({mesherExtraData});
}

export function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  chunk.dims._cachedBlockMesh = voxelMesherMesh(chunk.voxels, chunk.dims);
  return chunk;
}

export function blockMesher(voxels, dims) {
  _ensureInitialized();

  var cachedBlockMesh = dims._cachedBlockMesh;
  if (cachedBlockMesh) {
    dims._cachedBlockMesh = null;
    return cachedBlockMesh;
  } else {
    return voxelMesherMesh(voxels, dims);
  }
}

export function vegetationMesher(vegetations, dims) {
  _ensureInitialized();

  const result = [];
  let idx = 0;
  for (let z = 0; z < dims[2]; z++) {
    for (let y = 0; y < dims[1]; y++) {
      for (let x = 0; x < dims[0]; x++) {
        const vegetation = vegetations[idx];
        if (vegetation) {
          const position = [x, y, z];
          const spec = MODELS.VEGETATIONS[vegetation - 1];
          const mesh = {position, spec};
          result.push(mesh);
        }

        idx++;
      }
    }
  }
  return result;
}

export function entityMesher(entities, dims) {
  _ensureInitialized();

  const result = [];
  let idx = 0;
  for (let z = 0; z < dims[2]; z++) {
    for (let y = 0; y < dims[1]; y++) {
      for (let x = 0; x < dims[0]; x++) {
        const entity = entities[idx];
        if (entity) {
          const position = [x, y, z];
          const spec = MODELS.ENTITIES[entity - 1];
          const mesh = {position, spec};
          result.push(mesh);
        }

        idx++;
      }
    }
  }
  return result;
}

export function weatherMesher(weathers, dims) {
  _ensureInitialized();

  const result = [];
  let idx = 0;
  for (let z = 0; z < dims[2]; z++) {
    for (let y = 0; y < dims[1]; y++) {
      for (let x = 0; x < dims[0]; x++) {
        const weather = weathers[idx];
        if (weather) {
          const position = [x, y, z];
          const spec = MODELS.WEATHERS[weather - 1];
          const mesh = {position, spec};
          result.push(mesh);
        }

        idx++;
      }
    }
  }
  return result;
}

function _ensureInitialized() {
  if (voxelTerrainGenerate !== null && voxelMesherMesh !== null) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}
