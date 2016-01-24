const IMAGE_URLS = [
  '/tools/eraser.png',
  '/tools/magnifying-glass.png',
  '/tools/paint-brush.png',
  '/tools/pencil.png',
  '/tools/wrench.png',
].map(suffix => '/api/img' + suffix);

class Resources {
  constructor() {
    this._images = new Map();
  }

  getImage(url) {
    return this._images.get(url) || null;
  }

  load(cb) {
    let pending = IMAGE_URLS.length, error = null;

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
      img.style.position = 'absolute';
      img.style.top = 0;
      img.style.left = 0;
      img.style.visibility = 'hidden';

      $(document.body).append(img);
    };

    IMAGE_URLS.forEach(url => {
      loadImage(url, makePend(url));
    });
  }
}

const resources = new Resources();

export default resources;
