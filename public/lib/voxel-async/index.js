import voxelTerrain from '../voxel-terrain/index';
import voxelBlockMesher from '../voxel-block-mesher/index';
import voxelPlaneMesher from '../voxel-plane-mesher/index';

import {BLOCKS, MODELS} from '../../resources/index';

let voxelTerrainGenerate = null;
let voxelBlockMesherInstance = null;
let voxelPlaneMesherInstance = null;

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
}

export function generateSync(position) {
  _ensureInitialized();

  const chunk = voxelTerrainGenerate(position);
  chunk.dims._cachedBlockMesh = voxelBlockMesherInstance(chunk.voxels, chunk.dims);
  chunk.dims._cachedPlaneMesh = voxelPlaneMesherInstance(chunk.voxels, chunk.dims);
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

/* export function vegetationMesher(vegetations, dims) {
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
          const modelSpec = MODELS.WEATHERS[weather - 1];
          const {mode: modelName, static: modelStatic} = modelSpec;
          const height = dims[1] - y;
          const spec = {
            model: modelName,
            p: [height],
            s: []
          };
          const mesh = {position, spec};
          result.push(mesh);
        }

        idx++;
      }
    }
  }
  return result;
} */

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

function _ensureInitialized() {
  if (voxelTerrainGenerate !== null && voxelBlockMesherInstance !== null && voxelPlaneMesher !== null) {
    // nothing
  } else {
    throw new Error('voxel-async is not initialized');
  }
}
