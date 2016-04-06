import voxelTerrain from '../../../lib/voxel-terrain/index';
import voxelBlockGenerator from '../voxel-block-generator/index';
import voxelPlaneGenerator from '../voxel-plane-generator/index';
import voxelParticleGenerator from '../voxel-particle-generator/index';
import voxelSpriteGenerator from '../voxel-sprite-generator/index';
import voxelModelGenerator from '../voxel-model-generator/index';

import {BLOCKS} from '../../metadata/index';

let voxelTerrainGenerate = null;
let voxelBlockGeneratorInstance = null;
let voxelPlaneGeneratorInstance = null;
let voxelParticleGeneratorInstance = null;
let voxelSpriteGeneratorInstance = null;
let voxelModelGeneratorInstance = null;

const api = {};

function init({seed, chunkSize}) {
  voxelTerrainGenerate = voxelTerrain({seed, chunkSize});
  voxelBlockGeneratorInstance = voxelBlockGenerator(api);
  voxelPlaneGeneratorInstance = voxelPlaneGenerator(api);
  voxelParticleGeneratorInstance = voxelParticleGenerator(api);
  voxelSpriteGeneratorInstance = voxelSpriteGenerator(api);
  voxelModelGeneratorInstance = voxelModelGenerator(api);
}
api.init = init;

function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  const {voxels, depths, vegetations, weathers, effects, dims} = chunk;
  dims._cachedBlockMesh = voxelBlockGeneratorInstance({voxels, depths}, dims);
  dims._cachedPlaneMesh = voxelPlaneGeneratorInstance({vegetations, effects}, dims);
  dims._cachedParticleMesh = voxelParticleGeneratorInstance({weathers}, dims);
  return chunk;
}
api.generateSync = generateSync;

function blockGenerator(data, dims) {
  _ensureInitialized();

  const cachedBlockMesh = dims._cachedBlockMesh;
  if (cachedBlockMesh) {
    return cachedBlockMesh;
  } else {
    return voxelBlockGeneratorInstance(data, dims, {transparent: false});
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

function particleGenerator(data, dims) {
  _ensureInitialized();

  const cachedParticleMesh = dims._cachedParticleMesh;
  if (cachedParticleMesh) {
    return cachedParticleMesh;
  } else {
    return voxelParticleGeneratorInstance(data, dims);
  }
}
api.particleGenerator = particleGenerator;

function spriteGenerator(data, dims) {
  _ensureInitialized();

  const cachedSpriteMesh = dims._cachedSpriteMesh;
  if (cachedSpriteMesh) {
    return cachedSpriteMesh;
  } else {
    return voxelSpriteGeneratorInstance(data, dims);
  }
}
api.spriteGenerator = spriteGenerator;

function modelGenerator(data, dims) {
  _ensureInitialized();

  return voxelModelGeneratorInstance(data, dims);
}
api.modelGenerator = modelGenerator;

function clearMeshCache(chunk) {
  const {dims} = chunk;
  dims._cachedBlockMesh = null;
  dims._cachedPlaneMesh = null;
  dims._cachedSpriteMesh = null;
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
    voxelParticleGenerator !== null &&
    voxelSpriteGenerator !== null &&
    voxelModelGeneratorInstance !== null
  ) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}

module.exports = api;
