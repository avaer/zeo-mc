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
  chunk.dims._mesh = voxelMesherMesh(chunk.voxels, chunk.dims);
  return chunk;
}

export function mesher(voxels, dims) {
  _ensureInitialized();

  var cachedMesh = dims._mesh;
  if (cachedMesh) {
    dims._mesh = null;
    return cachedMesh;
  } else {
    return voxelMesherMesh(voxels, dims);
  }
}

function _ensureInitialized() {
  if (voxelTerrainGenerate !== null && voxelMesherMesh !== null) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}
