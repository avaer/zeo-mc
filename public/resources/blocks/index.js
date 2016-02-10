import {BIOME_TEXTURES, TREE_TEXTURES} from '../../constants/index';

const BLOCK_TEXTURES = require('./block-textures');

const MULTI_BLOCK_TEXTURES = (() => {
  const result = {};
  [''].concat(BIOME_TEXTURES).forEach(biomeTexture => {
    const biomeSubkey = biomeTexture ? ('_' + biomeTexture) : '';
    result['grass_' + biomeSubkey] = ['grass_top' + biomeSubkey, 'dirt', 'grass_top' +biomeSubkey];
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
    result[index] = k;
  }
  for (let k in MULTI_BLOCK_TEXTURES) {
    const index = BLOCK_TEXTURES[k] - 1;
    result[index] = MULTI_BLOCK_TEXTURES[k];
  }
  return result;
})();

export const TRANSPARENT = [
  'leaves_big_oak_plains',
  'log_big_oak'
];
