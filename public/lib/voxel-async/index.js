import voxelTerrain from '../voxel-terrain/index';
import voxelMesher from '../voxel-mesher/index';

import {BLOCKS} from '../../resources/index';

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

export function vegetationMesher(vegetations) {
  return vegetations;
}

export function entityMesher(entities) {
  return entities;
}

export function weatherMesher(weathers) {
  return weathers;
}

function _ensureInitialized() {
  if (voxelTerrainGenerate !== null && voxelMesherMesh !== null) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}
