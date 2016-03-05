import {MATERIAL_FRAMES, BIOME_TEXTURES, TREE_TEXTURES} from '../../constants/index';

const {floor} = Math;

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

const MULTI_FRAME_MATERIALS = {
  'water_still': _frameRange(32),
  'water_flow': _frameRange(32),
  'lava_still': _frameRange(20),
  /* 'lava_still': [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    18,
    17,
    16,
    15,
    14,
    13,
    12,
    11,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ], */
  'lava_flow': _frameRange(16),
  'fire_layer_0': _frameRange(32),
  'fire_layer_1': _frameRange(32),
  'sea_lantern': _frameRange(5),
  'prismarine_rough': _frameRange(4)
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
    result[index] = _expandNames(k);
  }
  for (let k in MULTI_BLOCK_TEXTURES) {
    const index = BLOCK_TEXTURES[k] - 1;
    result[index] = _expandNames(MULTI_BLOCK_TEXTURES[k]);
  }
  return result;
})();

export const FRAMES = (() => {
  const result = {};
  for (let i = 0; i < MATERIALS.length; i++) {
    const faces = MATERIALS[i];
    for (let j = 0; j < 6; j++) {
      const material = faces[j];
      result[material] = _repeatFrames(material);
    }
  }
  for (let k in MULTI_FRAME_MATERIALS) {
    const frames = MULTI_FRAME_MATERIALS[k];
    result[k] = _buildFrames(k, frames);
  }
  return result;
})();

global.MULTI_FRAME_MATERIALS = MULTI_FRAME_MATERIALS;

const TRANSPARENT_TEXTURES = [
  /water/,
  /lava/,
  /leaves/,
];

export const TRANSPARENT = (() => {
  function isTransparent(m) {
    return TRANSPARENT_TEXTURES.some(transparencySpec => {
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
  for (let m in BLOCKS) {
    if (isTransparent(m)) {
      const index = BLOCKS[m];
      result[index] = true;
    }
  }
  return result;
})();

function _frameRange(n) {
  let range = _range(0, n);

  // add
  range = (() => {
    const numToAdd = MATERIAL_FRAMES - range.length;

    if (numToAdd > 0) {
      const addIndex = (() => {
        const result = {};
        for (let i = 0; i < numToAdd; i++) {
          const index = floor(i * range.length / numToAdd);
          if (!(index in result)) {
            result[index] = 0;
          }
          result[index]++;
        }
        return result;
      })();

      const result = [];
      for (let i = 0; i < range.length; i++) {
        result.push(range[i]);

        const numToAddAtThisIndex = addIndex[i] || 0;
        for (let j = 0; j < numToAddAtThisIndex; j++) {
          result.push(range[i]);
        }
      }
      return result;
    } else {
      return range.slice();
    }
  })();

  // remove
  range = (() => {
    const numToRemove = range.length - MATERIAL_FRAMES;

    if (numToRemove > 0) {
      const removeIndex = (() => {
        const result = {};
        for (let i = 1; i <= numToRemove; i++) {
          const index = floor(i * (range.length - 1) / numToRemove);
          result[index] = true;
        }
        return result;
      })();

      const result = [];
      for (let i = 0; i < range.length; i++) {
        if (!removeIndex[i]) {
          result.push(range[i]);
        }
      }
      return result;
    } else {
      return range.slice();
    }
  })();

  return range;
}

function _range(a, b) {
  const l = b - a;
  const result = Array(l);
  for (let i = 0; i < l; i++) {
    result[i] = a + i;
  }
  return result;
}

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

function _repeatFrames(material) {
  const result = Array(MATERIAL_FRAMES);
  for (let i = 0; i < MATERIAL_FRAMES; i++) {
    result[i] = material;
  }
  return result;
}

function _buildFrames(name, frames) {
  const result = [];
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const frameName = name + '_' + frame;
    result.push(frameName);
  }
  return result;
}
