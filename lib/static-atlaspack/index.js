"use strict";

const path = require('path');
const fs = require('fs');

require('canvas-polyfill');
const atlaspack = require('atlaspack');
const touchup = require('touchup');
const metadata = require('../../metadata/index');
const BLOCKS = metadata.BLOCKS;

const SIZE = 2048;

function staticAtlaspack(cb) {
  function getLoadMaterials(opts) {
    const materials = opts.materials;
    const frames = opts.frames;

    const loadIndex = {};
    BLOCKS.MATERIALS.forEach(faceMaterials => {
      faceMaterials.forEach(material => {
        BLOCKS.FRAMES[material].forEach(texture => {
          loadIndex[material] = true;
        });
      });
    });

    const loadMaterials = Object.keys(loadIndex);
    return loadMaterials;
  }

  function loadTextures(opts, cb) {
    const atlas = opts.atlas;
    const loadMaterials = opts.loadMaterials;

    let error = null;
    let pending = loadMaterials.length;
    function pend(err) {
      error = error || err;
      if (--pending === 0) {
        cb();
      }
    }
    const getImg = (material, cb) => {
      getTexture(material, (err, img) => {
        if (!err) {
          var img2 = new Image();
          img2.onload = () => {
            cb(null, img2);
          };
          img2.onerror = err => {
            cb(err);
          };
          img2.id = material;
          img2.src = touchup.repeat(img, 2, 2);
        } else {
          cb(err);
        }
      });
    };
    const getTexture = (material, cb) => {
      fs.readFile(path.join(__dirname, '..', '..', 'public', 'img', 'textures', 'blocks', material + '.png'), (err, d) => {
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
    const packImg = (img, cb) => {
      const rect = atlas.pack(img);
      if (rect) {
        cb();
      } else {
        cb(new Error('failed to pack texture'));
      }
    };

    loadMaterials.forEach(material => {
      getImg(material, (err, img) => {
        if (!err) {
          packImg(img, pend);
        } else {
          pend(err);
        }
      });
    });
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

    const atlas = (() => {
      const atlas = atlaspack(canvas);
      atlas.tilepad = true;
      return atlas;
    })();
    return atlas;
  })();

  const loadMaterials = getLoadMaterials({
    materials: BLOCKS.MATERIALS,
    frames: BLOCKS.FRAMES,
  });

  loadTextures({
    atlas,
    loadMaterials,
  }, err => {
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

module.exports = staticAtlaspack;
