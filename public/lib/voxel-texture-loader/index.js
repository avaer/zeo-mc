class VoxelTextureLoader {
  constructor({getTextureUrl, THREE}) {
    this._getTextureUrl = getTextureUrl;
    this._THREE = THREE;

    this._cache = new Map();
  }

  getKey(url, offset) {
    return url + '-' + (offset ? offset.join(',') : null);
  }

  getTextureUrl(texture) {
    return this._getTextureUrl(texture);
  }

  getTexture(url, offset) {
    offset = offset || null;
    const {_THREE: THREE} = this;

    const key = this.getKey(url, offset);

    const cachedTexture = this._cache.get(key);
    if (cachedTexture) {
      return cachedTexture;
    } else {
      const texture = new THREE.Texture();
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      let cbs = [];
      texture.loaded = false;
      texture.onLoad = function(cb) {
        if (texture.loaded) {
          cb();
        } else {
          cbs.push(cb);
        }
      };
      texture.onLoaded = function(image) {
        texture.image = image;
        texture.needsUpdate = true;
        texture.loaded = true;

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

  getCachedTexture(url, offset) {
    offset = offset || null;

    const key = this.getKey(url, offset);

    const cachedTexture = this._cache.get(key);
    if (cachedTexture && cachedTexture.loaded) {
      return cachedTexture;
    } else {
      return null;
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

  loadTextures(textures, cb) {
    const numTextures = textures.length;
    if (numTextures > 0) {
      let pending = numTextures;
      const pend = () => {
        if (--pending === 0) {
          cb();
        }
      };
      for (let i = 0; i < numTextures; i++) {
        const texture = textures[i];
        const textureUrl = this.getTextureUrl(texture);
        const loadedTexture = this.getTexture(textureUrl);
        loadedTexture.onLoad(pend);
      }
    } else {
      cb();
    }
  }

  getImageData(texture) {
    const {image} = texture;
    const {naturalWidth: width, naturalHeight: height} = image;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    return imageData;
  }
}

function voxelTextureLoader(opts) {
  return new VoxelTextureLoader(opts);
}

module.exports = voxelTextureLoader;
