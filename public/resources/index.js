import {TOOL_NAMES, TOOL_SIZE} from '../constants/index';

const IMAGE_URLS = TOOL_NAMES.map(suffix => '/api/img/tools/' + suffix + '.png').concat([
  '/api/img/sky/skybox.jpg'
]);

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
      img.width = TOOL_SIZE;
      img.height = TOOL_SIZE;
      img.style.position = 'absolute';
      img.style.top = 0;
      img.style.left = 0;
      img.width = TOOL_SIZE;
      img.height = TOOL_SIZE;
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
