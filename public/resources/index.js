const IMAGE_URLS = [
  '/img/tools/eraser.png',
  '/img/tools/magnifying-glass.png',
  '/img/tools/paint-brush.png',
  '/img/tools/pencil.png',
  '/img/tools/wrench.png',
];

class Resources {
  constructor() {
    this._images = new Map();
  }

  getImage(url) {
    return this._images.get(url) || null;
  }

  load(cb) {
    let pending = IMAGE_URLS, error = null;

    const makePend = url => {
      return (err, img) => {
        if (!err) {
          this._images.set(url, img);
        } else {
          error = error || err;
        }

        if (--pending === 0) {
          cb(error);
        }
      };
    };

    const loadImage = (src, cb) => {
      const img = new Image();
      img.onload = () => {
        cb(null, img);
      };
      img.onerror = err => {
        cb(err);
      };
      img.src = src;
    };

    IMAGES_URLS.forEach(url => {
      loadImage(url, makePend(url));
    });
  }
}

const resources = new Resources();

export default resources;
