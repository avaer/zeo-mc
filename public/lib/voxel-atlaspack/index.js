import atlaspack from 'atlaspack';

class VoxelAtlaspack extends EventEmitter {
  constructor({jsonUrl, imgUrl}) {
    this._jsonUrl = jsonUrl;
    this._atlasUrl = atlasUrl;

    this._atlas = null;

    this._init();
  }

  _init() {
    let result = {
      json: null,
      img: null,
    };
    let pending = 2;
    const pend = () => {
      if (--pending === 0) {
        done();
      }
    };
    const handleError = err => {
      console.warn(err);
    };
    const done = () => {
      const atlas = (() => {
        const atlas = atlaspack().json(result.json);
        const canvas = (() => {
          const canvas = document.createElement(canvas);
          canvas.width = result.img.width;
          canvas.height = result.img.height;
          const ctx = canvase.getContext('2d');
          ctx.drawImage(result.img, 0, 0);
          return canvas;
        })();
        atlas.canvas = canvas;
        return atlas;
      })();
      this._atlas = atlas;

      this.emit('load');
    };

    fetch(this._jsonUrl).then(res => {
      res.text().then(s => {
        const j = JSON.parse(s);
        result.json = j;

        pend();
      }).catch(handleError)
    }).catch(handleError);

    const img = new Image();
    img.onload = () => {
      result.img = img;

      pend();
    };
    img.onerror = err => {
      handleError(err);
    };
    img.src = this._imgUrl;
  }

  getAtlas() {
    return this._atlas;
  }
}

const voxelAtlaspack = (() => {
  const canvas = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = size || 2048;
    canvas.height = size || 2048;

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
})();

export VoxelAtlaspack;
