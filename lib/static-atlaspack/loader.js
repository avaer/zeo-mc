import voxelAtlaspack from '../voxel-atlaspack/index';

function staticAtlaspackLoader(opts, cb) {
  const {jsonUrl,imgUrl} = opts;

  let results = {
    json: null,
    img: null,
  };
  let error = null;
  let pending = 2;
  const pend = () => {
    if (--pending === 0) {
      if (!error) {
        const {json, img} = results;
        const atlas = voxelAtlaspack().json(json);
        const canvas = (() => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          return canvas;
        })();
        atlas.tilepad = true;
        atlas.canvas = canvas;

        cb(null, atlas);
      } else {
        cb(error);
      }
    }
  };
  const handleError = err => {
    error = error || err;

    pend();
  };

  (() => {
    fetch(jsonUrl).then(res => {
      res.text().then(s => {
        const j = JSON.parse(s);
        results.json = j;

        pend();
      }).catch(handleError);
    }).catch(handleError);
  })();

  (() => {
    const img = new Image();
    img.onload = () => {
      results.img = img;

      pend();
    };
    img.onError = handleError;
    img.src = imgUrl;
  })();
}

export default staticAtlaspackLoader;
