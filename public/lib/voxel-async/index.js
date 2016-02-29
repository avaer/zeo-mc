import voxelTerrain from '../voxel-terrain/index';
import voxelBlockMesher from '../voxel-block-mesher/index';
import voxelPlaneMesher from '../voxel-plane-mesher/index';
import voxelModelMesher from '../voxel-model-mesher/index';

import {BLOCKS} from '../../resources/index';

let voxelTerrainGenerate = null;
let voxelBlockMesherInstance = null;
let voxelPlaneMesherInstance = null;
let voxelModelMesherInstance = null;

const api = {};

function init({seed, chunkSize}) {
  voxelTerrainGenerate = voxelTerrain({seed, chunkSize});
  voxelBlockMesherInstance = voxelBlockMesher(api);
  voxelPlaneMesherInstance = voxelPlaneMesher(api);
  voxelModelMesherInstance = voxelModelMesher(api);
}
api.init = init;

function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  const {voxels, vegetations, weathers, effects, dims} = chunk;
  dims._cachedBlockMesh = voxelBlockMesherInstance(voxels, dims/*, {transparent: false}*/);
  // dims._cachedFluidMesh = voxelBlockMesherInstance(voxels, dims, {transparent: true});
  dims._cachedPlaneMesh = voxelPlaneMesherInstance({vegetations, weathers, effects}, dims);
  return chunk;
}
api.generateSync = generateSync;

function blockMesher(voxels, dims) {
  _ensureInitialized();

  var cachedBlockMesh = dims._cachedBlockMesh;
  if (cachedBlockMesh) {
    return cachedBlockMesh;
  } else {
    return voxelBlockMesherInstance(voxels, dims, {transparent: false});
  }
}
api.blockMesher = blockMesher;

/* function fluidMesher(voxels, dims) {
  _ensureInitialized();

  var cachedFluidMesh = dims._cachedFluidMesh;
  if (cachedFluidMesh) {
    return cachedFluidMesh;
  } else {
    return voxelBlockMesherInstance(voxels, dims, {transparent: true});
  }
}
api.fluidMesher = fluidMesher; */

function planeMesher(data, dims) {
  _ensureInitialized();

  var cachedPlaneMesh = dims._cachedPlaneMesh;
  if (cachedPlaneMesh) {
    return cachedPlaneMesh;
  } else {
    return voxelPlaneMesherInstance(data, dims);
  }
}
api.planeMesher = planeMesher;

function entityMesher(entities, dims) {
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
api.entityMesher = entityMesher;

function modelMesher(data, dims) {
  _ensureInitialized();

  return voxelModelMesherInstance(data, dims);
}
api.modelMesher = modelMesher;

function clearMeshCache(chunk) {
  const {dims} = chunk;
  dims._cachedBlockMesh = null;
  // dims._cachedFluidMesh = null;
  dims._cachedPlaneMesh = null;
}
api.clearMeshCache = clearMeshCache;

function isTransparent(value) {
  return !!BLOCKS.TRANSPARENT[value];
}
api.isTransparent = isTransparent;

function _ensureInitialized() {
  if (voxelTerrainGenerate !== null && voxelBlockMesherInstance !== null && voxelPlaneMesher !== null && voxelModelMesherInstance !== null) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}

module.exports = api;
