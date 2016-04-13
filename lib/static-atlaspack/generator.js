"use strict";

const path = require('path');
const fs = require('fs');

require('canvas-polyfill');
const voxelAtlaspack = require('../voxel-atlaspack/index');
const touchup = require('touchup');
const metadata = require('../../metadata/index');
const BLOCKS = metadata.BLOCKS;
const MODELS = metadata.MODELS;

const SIZE = 2048;

function staticAtlaspackGenerator(cb) {
  function loadTextures(atlas, cb) {
    const blockMaterials = (() => {
      const materials = BLOCKS.MATERIALS;
      const frames = BLOCKS.FRAMES;

      const loadIndex = {};
      BLOCKS.MATERIALS.forEach(faceMaterials => {
        faceMaterials.forEach(material => {
          BLOCKS.FRAMES[material].forEach(texture => {
            loadIndex[material] = true;
          });
        });
      });

      return Object.keys(loadIndex);
    })();
    const modelMaterials = MODELS.MODEL_NAMES.map(model => MODELS.MODEL_INDEX[model].TEXTURE);

    const getImgFile = (p, cb) => {
      fs.readFile(p, (err, d) => {
        const img = document.createElement('img');
        img.onload = () => {
          cb(null, img);
        };
        img.onerror = err => {
          cb(err);
        };
        img.src = d;
      });
    };
    const repeatImg = (img, cb) => {
      const img2 = new Image();
      img2.onload = () => {
        cb(null, img2);
      };
      img2.onerror = err => {
        cb(err);
      };
      img2.src = touchup.repeat(img, 2, 2);
    };
    const packImg = (img, cb) => {
      const rect = atlas.pack(img);
      if (rect) {
        cb();
      } else {
        cb(new Error('failed to pack texture'));
      }
    };

    const getBlockImg = (material, cb) => {
      getImgFile(path.join(__dirname, '..', '..', 'public', 'img', 'textures', 'blocks', material + '.png'), (err, img) => {
        if (!err) {
          repeatImg(img, (err, img) => {
            if (!err) {
              img.id = material;
              cb(null, img);
            } else {
              cb(err);
            }
          });
        } else {
          cb(err);
        }
      });
    };
    const getModelImg = (material, cb) => {
      getImgFile(path.join(__dirname, '..', '..', 'public', 'img', 'textures', 'entity', material + '.png'), (err, img) => {
        if (!err) {
          img.id = material;
          cb(null, img);
        } else {
          cb(err);
        }
      });
    };

    const loadMaterials = (materials, getImg) => {
      return cb => {
        const recurse = i => {
          if (i < materials.length) {
            const material = materials[i];
            getImg(material, (err, img) => {
              if (!err) {
                packImg(img, err => {
                  if (!err) {
                    recurse(i + 1);
                  } else {
                    cb(err);
                  }
                });
              } else {
                cb(err);
              }
            });
          } else {
            cb();
          }
        };
        recurse(0);
      };
    };

    const serial = (steps, cb) => {
      const recurse = i => {
        if (i < steps.length) {
          const step = steps[i];
          step(err => {
            if (!err) {
              recurse(i + 1);
            } else {
              cb(err);
            }
          });
        } else {
          cb();
        }
      };
      recurse(0);
    };

    serial([
      loadMaterials(blockMaterials, getBlockImg),
      loadMaterials(modelMaterials, getModelImg),
    ], cb);
  }

  const atlas = (() => {
    const canvas = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      return canvas;
    })();
    const atlas = voxelAtlaspack(canvas);
    atlas.tilepad = true;
    return atlas;
  })();

  loadTextures(atlas, err => {
    if (!err) {
      atlas.canvas.toBuffer((err, img) => {
        if (!err) {
          const json = atlas.json();
          cb(null, {json, img});
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
}

module.exports = staticAtlaspackGenerator;
