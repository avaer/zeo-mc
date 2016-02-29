import voxelTerrain from '../voxel-terrain/index';
import voxelBlockMesher from '../voxel-block-mesher/index';
import voxelPlaneMesher from '../voxel-plane-mesher/index';
import voxelModelMesher from '../voxel-model-mesher/index';

import {BLOCKS} from '../../resources/index';

let voxelTerrainGenerate = null;
let voxelBlockMesherInstance = null;
let voxelPlaneMesherInstance = null;
let voxelModelMesherInstance = null;

const mesherExtraData = (() => {
  const transparentTypes = (() => {
    function isTransparent(m) {
      return BLOCKS.TRANSPARENT.some(transparencySpec => {
        if (typeof transparencySpec === 'string') {
          return m === transparencySpec;
        } else if (transparencySpec instanceof RegExp) {
          return transparencySpec.test(m);
        } else {
          return false;
        }
      });
    }

    const result = {};
    for (let m in BLOCKS.BLOCKS) {
      if (isTransparent(m)) {
        const index = BLOCKS.BLOCKS[m];
        result[index] = true;
      }
    }
    return result;
  })();
  const mesherExtraData = {transparentTypes};
  return mesherExtraData;
})();

export function init({seed, chunkSize}) {
  voxelTerrainGenerate = voxelTerrain({seed, chunkSize});
  voxelBlockMesherInstance = voxelBlockMesher({mesherExtraData});
  voxelPlaneMesherInstance = voxelPlaneMesher();
  voxelModelMesherInstance = voxelModelMesher();
}

export function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  const {voxels, vegetations, weathers, effects, dims} = chunk;
  chunk.dims._cachedBlockMesh = voxelBlockMesherInstance(voxels, dims, {transparent: false});
  chunk.dims._cachedFluidMesh = voxelBlockMesherInstance(voxels, dims, {transparent: true});
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
    return voxelBlockMesherInstance(voxels, dims, {transparent: false});
  }
}

export function fluidMesher(voxels, dims) {
  _ensureInitialized();

  var cachedFluidMesh = dims._cachedFluidMesh;
  if (cachedFluidMesh) {
    dims._cachedFluidMesh = null;
    return cachedFluidMesh;
  } else {
    return voxelBlockMesherInstance(voxels, dims, {transparent: true});
  }
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
