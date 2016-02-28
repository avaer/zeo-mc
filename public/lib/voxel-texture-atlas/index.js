import events from 'events';
const EventEmitter = events.EventEmitter;

import atlaspack from 'atlaspack';
// import opaque from 'opaque';
import touchup from 'touchup';

class VoxelTextureAtlas extends EventEmitter {
  constructor({materials = [], size = 2048, getTextureImage, THREE}) {
    super();

    this._materials = materials;
    this._materialUvs = null;

    const canvas = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = size || 2048;
      canvas.height = size || 2048;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      return canvas;
    })();
    this._canvas = canvas;

    const texture = (() => {
      const texture = new THREE.Texture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      return texture;
    })();
    this._texture = texture;

    const atlas = (() => {
      const atlas = atlaspack(canvas);
      atlas.tilepad = true;
      return atlas;
    })();
    this._atlas = atlas;

    this._getTextureImage = getTextureImage;

    this._init();
  }

  getTexture() {
    return this._texture;
  }

  getFrameMaterials(value) {
    return this._materials[value - 1] || this._materials[0];
  }

  getMaterialUvs(material) {
    return this._materialUvs[material] || this._materialUvs[0];
  }

  _init() {
    const loadIndex = {};
    this._materials.forEach(function(mats) {
      mats.forEach(function(mats2) {
        mats2.forEach(function(mat) {
          loadIndex[mat] = true;
        });
      });
    });

    const loadMaterials = Object.keys(loadIndex);
    let pending = loadMaterials.length;
    function pend() {
      if (--pending === 0) {
        done();
      }
    }
    const done = () => {
      this._ensurePowerof2();

      this._texture.needsUpdate = true;
      this._materialUvs = this._atlas.uv(this._canvas.width, this._canvas.height);

      this.emit('load');
    };
    const getImg = (material, cb) => {
      this._getTextureImage(material, (err, img) => {
        if (!err) {
          var img2 = new Image();
          img2.onload = function() {
            cb(null, img2);
          };
          img2.onerror = function(err) {
            cb(err);
          };
          img2.id = material;
          img2.src = touchup.repeat(img, 2, 2);
        } else {
          cb(err);
        }
      });
    };
    const packImg = (img, cb) => {
      const node = this._atlas.pack(img);
      if (node === false) {
        this.atlas = this.atlas.expand(img);
        this.atlas.tilepad = true;
      }
      cb();
    };
    loadMaterials.forEach(material => {
      getImg(material, (err, img) => {
        if (!err) {
          packImg(img, err => {
            if (!err) {
              pend();
            } else {
              console.error(err);
            }
          });
        } else {
          console.error(err);
        }
      });
    });
  }

  // Ensure the texture stays at a power of 2 for mipmaps
  // this is cheating :D
  _ensurePowerof2() {
    const {_canvas: canvas} = this;
    let {width} = canvas;
    const {height} = canvas;
    function pow2(x) {
      x--;
      x |= x >> 1;
      x |= x >> 2;
      x |= x >> 4;
      x |= x >> 8;
      x |= x >> 16;
      x++;
      return x;
    }
    if (height > width) {
      width = height;
    };
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    canvas.width = canvas.height = pow2(width);
    ctx.putImageData(imageData, 0, 0);
  }
}

function voxelTextureAtlas(opts) {
  return new VoxelTextureAtlas(opts);
}

module.exports = voxelTextureAtlas;
