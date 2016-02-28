import {BIOME_TEXTURES, TREE_TEXTURES} from '../../constants/index';

const BLOCK_TEXTURES = require('./block-textures');

const MULTI_BLOCK_TEXTURES = (() => {
  const result = {};
  [''].concat(BIOME_TEXTURES).forEach(biomeTexture => {
    const biomeSubkey = biomeTexture ? ('_' + biomeTexture) : '';
    result['grass_top' + biomeSubkey] = ['grass_top' + biomeSubkey, 'dirt', 'grass_side' +biomeSubkey];
  });
  TREE_TEXTURES.forEach(treeTexture => {
    result['log_' + treeTexture] = ['log_' + treeTexture + '_top', 'log_' + treeTexture + '_top', 'log_' + treeTexture];
  });
  return result;
})();

export const BLOCKS = (() => {
  const result = {};
  for (let k in BLOCK_TEXTURES) {
    result[k] = BLOCK_TEXTURES[k];
  }
  return result;
})();

export const MATERIALS = (() => {
  const result = [];
  for (let k in BLOCK_TEXTURES) {
    const index = BLOCK_TEXTURES[k] - 1;
    result[index] = [_expandNames(k)];
  }
  for (let k in MULTI_BLOCK_TEXTURES) {
    const index = BLOCK_TEXTURES[k] - 1;
    result[index] = [_expandNames(MULTI_BLOCK_TEXTURES[k])];
  }
  return result;
})();

function _expandNames(name) {
  // if (name === null) return Array(6);
  // if (name.top) return [name.back, name.front, name.top, name.bottom, name.left, name.right];

  if (!Array.isArray(name)) name = [name];

  // load the 0 texture to all
  if (name.length === 1) name = [name[0],name[0],name[0],name[0],name[0],name[0]];
  // 0 is top/bottom, 1 is sides
  else if (name.length === 2) name = [name[1],name[1],name[0],name[0],name[1],name[1]];
  // 0 is top, 1 is bottom, 2 is sides
  else if (name.length === 3) name = [name[2],name[2],name[0],name[1],name[2],name[2]];
  // 0 is top, 1 is bottom, 2 is front/back, 3 is left/right
  else if (name.length === 4) name = [name[2],name[2],name[0],name[1],name[3],name[3]];

  return name;
}

export const TRANSPARENT = [
  'water_still',
  'leaves_big_oak_plains',
  'log_big_oak',
];
