import voxelTerrain from '../voxel-terrain/index';
import voxelMesher from '../voxel-mesher/index';

import {SEED, CHUNK_SIZE} from '../../constants/index';
import {BLOCKS} from '../../resources/index';

const voxelTerrainGenerate = voxelTerrain({
  seed: SEED,
  chunkSize: CHUNK_SIZE
});

const transparentTypes = (() => {
  const result = {};
  BLOCKS.TRANSPARENT.forEach(t => {
    const index = BLOCKS.BLOCKS[t];
    result[index] = true;
  });
  return result;
})();
const mesherExtraData = {transparentTypes};
const voxelMesherMesh = voxelMesher({mesherExtraData});

export function generateSync(position) {
  const chunk = voxelTerrainGenerate(position);
  chunk.dims._mesh = voxelMesherMesh(chunk.voxels, chunk.dims);
  return chunk;
}

export function mesher(voxels, dims) {
  var cachedMesh = dims._mesh;
  if (cachedMesh) {
    dims._mesh = null;
    return cachedMesh;
  } else {
    return voxelMesherMesh(voxels, dims);
  }
}
