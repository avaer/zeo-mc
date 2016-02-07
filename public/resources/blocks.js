const BLOCK_TEXTURES = require('./block-textures');

const MULTI_BLOCK_TEXTURES = {
  'grass_top': ['grass_top', 'dirt', 'grass_side'],
  'log_acacia': ['log_acacia_top', 'log_acacia', 'log_acacia_top'],
  'log_big_oak': ['log_big_oak_top', 'log_big_oak', 'log_big_oak_top'],
  'log_birch': ['log_birch_top', 'log_birch', 'log_birch_top'],
  'log_jungle': ['log_jungle_top', 'log_jungle', 'log_jungle_top'],
  'log_oak': ['log_oak_top', 'log_oak', 'log_oak_top'],
  'log_spruce': ['log_spruce_top', 'log_spruce', 'log_spruce_top'],
};

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
