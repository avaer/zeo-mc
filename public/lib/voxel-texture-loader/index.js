class VoxelTextureLoader {
  constructor({THREE}) {
    this._THREE = THREE;

    this._cache = new Map();
  }

  getKey(url, offset) {
    return url + '-' + (offset ? offset.join(',') : null);
  }

  get(url, offset) {
    offset = offset || null;

    const key = this.getKey(url, offset);

    const cachedTexture = this._cache.get(key);
    if (cachedTexture) {
      return cachedTexture;
    } else {
      const texture = new THREE.Texture();
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      let cbs = [];
      let loaded = false;
      texture.onLoad = function(cb) {
        if (loaded) {
          cb();
        } else {
          cbs.push(cb);
        }
      };
      texture.onLoaded = function(image) {
        texture.image = image;
        texture.needsUpdate = true;

        loaded = true;
        for (let i = 0; i < cbs.length; i++) {
          const cb = cbs[i];
          cb();
        }
        cbs = [];
      };

      this._cache.set(key, texture);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (offset) {
          const croppedImage = this.cropImage(img, offset);
          croppedImage.onload = () => {
            texture.onLoaded(croppedImage);
          };
        } else {
          texture.onLoaded(img);
        }
      };

      return texture;
    }
  }

  cropImage(img, offset) {
    const startX = offset[0];
    const startY = offset[1];
    const width = offset[2] - offset[0];
    const height = offset[3] - offset[1];

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(img, startX, startY, width, height, 0, 0, width, height);
    const dataUrl = canvas.toDataURL();

    const newImg = new Image();
    newImg.src = dataUrl;
    return newImg;
  }
}

function voxelTextureLoader(opts) {
  return new VoxelTextureLoader(opts);
}

module.exports = voxelTextureLoader;
