import voxelTerrain from '../voxel-terrain/index';
import voxelBlockMesher from '../voxel-block-mesher/index';
import voxelPlaneMesher from '../voxel-plane-mesher/index';
import voxelModelMesher from '../voxel-model-mesher/index';

import {BLOCKS} from '../../resources/index';

let voxelTerrainGenerate = null;
let voxelBlockMesherInstance = null;
let voxelPlaneMesherInstance = null;
let voxelModelMesherInstance = null;

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
  voxelBlockMesherInstance = voxelBlockMesher({mesherExtraData});
  voxelPlaneMesherInstance = voxelPlaneMesher();
  voxelModelMesherInstance = voxelModelMesher();
}

export function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  const {voxels, vegetations, weathers, effects, dims} = chunk;
  chunk.dims._cachedBlockMesh = voxelBlockMesherInstance(voxels, dims);
  chunk.dims._cachedPlaneMesh = voxelPlaneMesherInstance({vegetations, weathers, effects}, dims);
  return chunk;
}

export function blockMesher(voxels, dims) {
  _ensureInitialized();

  var cachedBlockMesh = dims._cachedBlockMesh;
  if (cachedBlockMesh) {
    dims._cachedBlockMesh = null;
    return cachedBlockMesh;
  } else {
    return voxelBlockMesherInstance(voxels, dims);
  }
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

export function planeMesher(data, dims) {
  _ensureInitialized();

  var cachedPlaneMesh = dims._cachedPlaneMesh;
  if (cachedPlaneMesh) {
    dims._cachedPlaneMesh = null;
    return cachedPlaneMesh;
  } else {
    return voxelPlaneMesherInstance(data, dims);
  }
}

export function modelMesher(data, dims) {
  _ensureInitialized();

  return voxelModelMesherInstance(data, dims);
}

function _ensureInitialized() {
  if (voxelTerrainGenerate !== null && voxelBlockMesherInstance !== null && voxelPlaneMesher !== null && voxelModelMesherInstance !== null) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}
