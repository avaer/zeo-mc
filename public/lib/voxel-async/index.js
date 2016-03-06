import voxelTerrain from '../voxel-terrain/index';
import voxelBlockGenerator from '../voxel-block-generator/index';
import voxelPlaneGenerator from '../voxel-plane-generator/index';
import voxelModelGenerator from '../voxel-model-generator/index';

import {BLOCKS} from '../../resources/index';

let voxelTerrainGenerate = null;
let voxelBlockGeneratorInstance = null;
let voxelPlaneGeneratorInstance = null;
let voxelModelGeneratorInstance = null;

const api = {};

function init({seed, chunkSize}) {
  voxelTerrainGenerate = voxelTerrain({seed, chunkSize});
  voxelBlockGeneratorInstance = voxelBlockGenerator(api);
  voxelPlaneGeneratorInstance = voxelPlaneGenerator(api);
  voxelModelGeneratorInstance = voxelModelGenerator(api);
}
api.init = init;

function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  const {voxels, vegetations, weathers, effects, dims} = chunk;
  dims._cachedBlockMesh = voxelBlockGeneratorInstance(voxels, dims/*, {transparent: false}*/);
  dims._cachedPlaneMesh = voxelPlaneGeneratorInstance({vegetations, weathers, effects}, dims);
  return chunk;
}
api.generateSync = generateSync;

function blockGenerator(voxels, dims) {
  _ensureInitialized();

  const cachedBlockMesh = dims._cachedBlockMesh;
  if (cachedBlockMesh) {
    return cachedBlockMesh;
  } else {
    return voxelBlockGeneratorInstance(voxels, dims, {transparent: false});
  }
}
api.blockGenerator = blockGenerator;

function planeGenerator(data, dims) {
  _ensureInitialized();

  const cachedPlaneMesh = dims._cachedPlaneMesh;
  if (cachedPlaneMesh) {
    return cachedPlaneMesh;
  } else {
    return voxelPlaneGeneratorInstance(data, dims);
  }
}
api.planeGenerator = planeGenerator;

function entityGenerator(entities, dims) {
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
api.entityGenerator = entityGenerator;

function modelGenerator(data, dims) {
  _ensureInitialized();

  return voxelModelGeneratorInstance(data, dims);
}
api.modelGenerator = modelGenerator;

function clearMeshCache(chunk) {
  const {dims} = chunk;
  dims._cachedBlockMesh = null;
  dims._cachedPlaneMesh = null;
}
api.clearMeshCache = clearMeshCache;

function isTransparent(value) {
  return !!BLOCKS.TRANSPARENT[value];
}
api.isTransparent = isTransparent;

function _ensureInitialized() {
  if (
    voxelTerrainGenerate !== null &&
    voxelBlockGeneratorInstance !== null &&
    voxelPlaneGenerator !== null &&
    voxelModelGeneratorInstance !== null
  ) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}

module.exports = api;
