import events from 'events';
const EventEmitter = events.EventEmitter;

import atlaspack from 'atlaspack';
import touchup from 'touchup';

import {MATERIAL_FRAMES} from '../../constants/index';

const FACE_VERTICES = 6;
const FRAME_UV_ATTRIBUTE_SIZE = 4;
const FRAME_UV_ATTRIBURES = MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTE_SIZE;

class VoxelTextureAtlas extends EventEmitter {
  constructor({materials = [], frames = {}, size = 2048, getTextureImage, THREE}) {
    super();

    this._materials = materials;
    this._frames = frames;
    this._faceMaterials = null;
    this._atlasUvs = null;
    this._faceNormalMaterials = null;
    this._blockMeshFaceFrameUvs = null;
    this._planeMeshFrameUvs = null;

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

  getAtlasUvs(material) {
    return this._atlasUvs[material];
  }

  getFaceNormalMaterial(colorValue, normalDirection) {
    return this._faceNormalMaterials(colorValue, normalDirection);
  }

  getBlockMeshFaceFrameUvs(material) {
    return this._blockMeshFaceFrameUvs[material];
  }

  getPlaneMeshFrameUvs(material) {
    return this._planeMeshFrameUvs[material];
  }

  _init() {
    const loadIndex = {};
    this._materials.forEach(faceMaterials => {
      faceMaterials.forEach(material => {
        this._frames[material].forEach(texture => {
          loadIndex[material] = true;
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

      this._faceMaterials = this._buildFaceMaterials();
      this._atlasUvs = this._buildAtlasUvs();
      this._faceNormalMaterials = this._buildFaceNormalMaterials();
      this._blockMeshFaceFrameUvs = this._buildBlockMeshFaceFrameUvs();
      this._planeMeshFrameUvs = this._buildPlaneMeshFrameUvs();

      this.emit('load', null);
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

  _buildFaceMaterials() {
    const result = [];
    const index = {}
    for (let i = 0; i < this._materials.length; i++) {
      const faces = this._materials[i];
      for (let j = 0; j < faces.length; j++) {
        const material = faces[j];
        if (!(material in index)) {
          result.push(material);
          index[material] = true;
        }
      }
    }
    return result;
  }

  _buildAtlasUvs() {
    return this._atlas.uv(this._canvas.width, this._canvas.height);
  }

  _buildFaceNormalMaterials() {
    function getKey(colorValue, normalDirection) {
      return [colorValue, normalDirection].join(':');
    }

    const map = {};
    for (let i = 0; i < this._materials.length; i++) {
      const faces = this._materials[i];
      for (let j = 0; j < FACE_VERTICES; j++) {
        map[getKey(i + 1, j)] = faces[j];
      }
    }

    return function(colorValue, normalDirection) {
      return map[getKey(colorValue, normalDirection)];
    };
  }

  _buildBlockMeshFaceFrameUvs() {
    const result = {};

    window.atlas = this;

    const {_canvas: canvas} = this;
    const {width, height} = canvas;
    for (let i = 0; i < this._faceMaterials.length; i++) {
      const faceMaterial = this._faceMaterials[i];

      const vertexFrameUvs = (() => {
        const result = new Float32Array(MATERIAL_FRAMES * 2);

        const frames = this._frames[faceMaterial];
        for (let j = 0; j < MATERIAL_FRAMES; j++) {
          const frameMaterial = frames[j];
          const atlasuvs = this.getAtlasUvs(frameMaterial);
          // const atlasuvs = this.getAtlasUvs(frames[10]); // XXX

          // const [topUV, rightUV, bottomUV, leftUV] = atlasuvs;
          const [topUV,,bottomUV,] = atlasuvs;

          // WARNING: ugly hack ahead.
          // I'm (ab)using faceVertexUvs = the 'uv' attribute: it is the same for all coordinates,
          // and the fractional part is the top-left UV, the whole part is the tile size.

          const tileSizeX = bottomUV[0] - topUV[0];
          const tileSizeY = topUV[1] - bottomUV[1];

          // half because of four-tap repetition
          const tileSizeIntX = (tileSizeX * width) / 2;
          const tileSizeIntY = (tileSizeY * height) / 2;

          // set all to top (+ encoded tileSize)
          const frameUvIndex = j * 2;
          result[frameUvIndex + 0] = tileSizeIntX + topUV[0];
          result[frameUvIndex + 1] = tileSizeIntY + (1.0 - topUV[1]);
        }

        return result;
      })();

      const faceFrameUvs = (() => {
        // sequentially copy FACE_VERTICES copies of each FRAME_UV_ATTRIBUTE_SIZE chunk of data
        const result = new Float32Array(FACE_VERTICES * MATERIAL_FRAMES * 2);
        for (let j = 0; j < FRAME_UV_ATTRIBURES; j++) {
          for (let k = 0; k < FACE_VERTICES; k++) {
            result.set(
              vertexFrameUvs.slice(FRAME_UV_ATTRIBUTE_SIZE * j, FRAME_UV_ATTRIBUTE_SIZE * (j + 1)),
              j * FACE_VERTICES * FRAME_UV_ATTRIBUTE_SIZE + k * FRAME_UV_ATTRIBUTE_SIZE
            );
          }
        }
        return result;
      })();

      result[faceMaterial] = faceFrameUvs;
    }
    return result;
  }

  _buildPlaneMeshFrameUvs() {
    return null; // XXX
  }
}

function voxelTextureAtlas(opts) {
  return new VoxelTextureAtlas(opts);
}

module.exports = voxelTextureAtlas;
