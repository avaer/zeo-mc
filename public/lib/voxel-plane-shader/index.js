// var tic = require('tic')();
var createAtlas = require('atlaspack');
var isTransparent = require('opaque').transparent;
var touchup = require('touchup');
var voxelFakeAo = require('voxel-fakeao');
var voxelBlockShader = require('../voxel-block-shader/index');

var floor = Math.floor;
var ceil = Math.ceil;
var round = Math.round;

module.exports = voxelPlaneShader;

function reconfigure(old) {
  var ret = module.exports(old.opts);
  ret.load(old.names);

  return ret;
}

function voxelPlaneShader(opts) {
  if (!(this instanceof voxelPlaneShader)) return new voxelPlaneShader(opts || {});
  var self = this;
  this.game = opts.game;
  this.opts = opts;
  this.names = [];
  this.materials = [];
  this.transparents = [];
  this.getTextureImage = opts.getTextureImage;
  this.loading = 0;
  this.ao = voxelFakeAo(this.game);

  var useFlatColors = opts.materialFlatColor === true;
  delete opts.materialFlatColor;

  this.useFourTap = opts.useFourTap = opts.useFourTap === undefined ? true : opts.useFourTap;
  this.useTransparency = opts.useTransparency = opts.useTransparency === undefined ? true : opts.useTransparency;

  // create a canvas for the texture atlas
  this.canvas = (typeof document !== 'undefined') ? document.createElement('canvas') : {};
  this.canvas.width = opts.atlasWidth || 2048;
  this.canvas.height = opts.atlasHeight || 2048;
  var ctx = this.canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  // create core atlas and texture
  this.atlas = createAtlas(this.canvas);
  this.atlas.tilepad = opts.tilepad = opts.tilepad === undefined ? true : opts.tilepad;
  this._atlasuv = false;
  this._atlaskey = false;

  const {THREE} = this.game;

  this.texture = new THREE.Texture(this.canvas);
  this.texture.magFilter = THREE.NearestFilter;
  this.texture.minFilter = THREE.LinearMipMapLinearFilter;

  this.material = new THREE.MeshLambertMaterial({
    ambient: 0xbbbbbb,
    transparent: true,
    side: THREE.FrontSide,
    // lights: [], // force lights refresh to setup uniforms, three.js WebGLRenderer line 4323
    fog: true,
    map: this.texture
  });

  // a place for meshes to wait while textures are loading
  this._meshQueue = [];
}

voxelPlaneShader.prototype.reconfigure = function() {
  return reconfigure(this);
};

voxelPlaneShader.prototype.load = function(names, done) {
  if (!names || names.length === 0) return;
  this.names = this.names.concat(names); // save for reconfiguration

  var self = this;
  if (!Array.isArray(names)) names = [names];
  done = done || function() {};
  this.loading++;

  var materialSlice = names.map(self._expandName);
  self.materials = self.materials.concat(materialSlice);

  // load onto the texture atlas
  var load = Object.create(null);
  materialSlice.forEach(function(mats) {
    mats.forEach(function(mat) {
      if (mat.slice(0, 1) === '#') return;
      // todo: check if texture already exists
      load[mat] = true;
    });
  });
  if (Object.keys(load).length > 0) {
    each(Object.keys(load), self.pack.bind(self), function() {
      self._afterLoading();
      done(materialSlice);
    });
  } else {
    self._afterLoading();
  }
};

voxelPlaneShader.prototype.getTransparentVoxelTypes = function() {
  var transparentMap = {};

  for (var i = 0; i < this.materials.length; i += 1) {
    var blockIndex = i + 1;
    var materialSlice = this.materials[i];

    var anyTransparent = false;
    for (var j = 0; j < materialSlice.length; j += 1) {
      anyTransparent |= this.transparents.indexOf(materialSlice[j]) !== -1;
    }

    if (anyTransparent)
      transparentMap[blockIndex] = true;
  }

  return transparentMap;
};

voxelPlaneShader.prototype.pack = function(name, done) {
  var self = this;
  function pack(img) {
    var node = self.atlas.pack(img);
    if (node === false) {
      self.atlas = self.atlas.expand(img);
      self.atlas.tilepad = true;
    }
    done();
  }
  if (typeof name === 'string') {
    self.getTextureImage(name, function(img) {

      if (Array.isArray(img)) {
        // TODO: support animated textures, returned as array https://github.com/deathcap/voxel-texture-shader/issues/5
        // but for now, only use the first frame
        img = img[0];
      }

      if (isTransparent(img)) {
        self.transparents.push(name);
      }

      img.id = name;
      pack(img);
      
      /* // repeat 2x2 for mipmap padding 4-tap trick
      // TODO: replace with atlaspack padding, but changed to 2x2: https://github.com/deathcap/atlaspack/tree/tilepadamount
      var img2 = new Image();
      img2.id = name;
      img2.src = touchup.repeat(img, 2, 2);
      img2.onload = function() {
        pack(img2);
      } */
    }, function(err, img) {
      console.error('Couldn\'t load URL [' + img.src + ']: ',err);
      done();
    });
  } else {
    throw new Error('fail to load');
    pack(name);
  }
  return self;
};

voxelPlaneShader.prototype.find = function(name) {
  // lookup first material with any matching texture name
  var self = this;
  var type = 0;
  self.materials.forEach(function(mats, i) {
    mats.forEach(function(mat) {
      if (mat === name) {
        type = i + 1;
        return false;
      }
    });
    if (type !== 0) return false;
  });
  return type;
};

voxelPlaneShader.prototype._expandName = function(name) {
  if (name === null) return Array(6);
  if (name.top) return [name.back, name.front, name.top, name.bottom, name.left, name.right];
  if (!Array.isArray(name)) name = [name];
  // load the 0 texture to all
  if (name.length === 1) name = [name[0],name[0],name[0],name[0],name[0],name[0]];
  // 0 is top/bottom, 1 is sides
  if (name.length === 2) name = [name[1],name[1],name[0],name[0],name[1],name[1]];
  // 0 is top, 1 is bottom, 2 is sides
  if (name.length === 3) name = [name[2],name[2],name[0],name[1],name[2],name[2]];
  // 0 is top, 1 is bottom, 2 is front/back, 3 is left/right
  if (name.length === 4) name = [name[2],name[2],name[0],name[1],name[3],name[3]];
  return name;
};

voxelPlaneShader.prototype._afterLoading = function() {
  var self = this;
  function alldone() {
    self.loading--;
    self._atlasuv = self.atlas.uv(self.canvas.width, self.canvas.height);
    self._atlaskey = Object.create(null);
    self.atlas.index().forEach(function(key) {
      self._atlaskey[key.name] = key;
    });
    self.texture.needsUpdate = true;
    self.material.needsUpdate = true;
    //window.open(self.canvas.toDataURL());
    if (self._meshQueue.length > 0) {
      for (let i = 0; i < self._meshQueue.length; i++) {
        const mesh = self._meshQueue[i];
        self.paint(mesh);
      }
      self._meshQueue = [];
    }
  }
  self._powerof2(function() {
    setTimeout(alldone, 100);
  });
};

// Ensure the texture stays at a power of 2 for mipmaps
// this is cheating :D
voxelPlaneShader.prototype._powerof2 = function(done) {
  var w = this.canvas.width;
  var h = this.canvas.height;
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
  if (h > w) w = h;
  var old = this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height);
  this.canvas.width = this.canvas.height = pow2(w);
  this.canvas.getContext('2d').putImageData(old, 0, 0);
  done();
};

voxelPlaneShader.prototype.paint = function(mesh) {
  var self = this;

  // if were loading put into queue
  if (self.loading > 0) {
    self._meshQueue.push(mesh);
    return false;
  }

  const uvs = mesh.geometry.getAttribute('uv');

  if (uvs) {
    const numVertices = uvs.array.length / 2;
    const numTrigs = numVertices / 3;
    const numFaces = numTrigs / 2;
    for (let i = 0; i < numFaces; i++) {
      const faceMaterial = (() => {
        const faceMaterials = (() => {
          const colors = mesh.geometry.getAttribute('color');
          const colorIndex = i * 2 * 3 * 3;
          const colorArray = [colors.array[colorIndex + 0], colors.array[colorIndex + 1], colors.array[colorIndex + 2]]
          const colorValue = voxelBlockShader.colorArrayToValue(colorArray);
          const faceMaterials = self.materials[colorValue - 1] || self.materials[0];
          return faceMaterials;
        })();
        const faceMaterial = faceMaterials[0] || '';
        return faceMaterial;
      })();

      // if just a simple color
      /* if (faceMaterial.slice(0, 1) === '#') {
        self.ao(face, faceMaterial);
        return;
      } */

      var atlasuv = self._atlasuv[faceMaterial];
      if (!atlasuv) {
        throw new Error('no material index');
      }

      // If a transparent texture use transparent material
      // face.materialIndex = (self.useTransparency && self.transparents.indexOf(faceMaterial) !== -1) ? 1 : 0; // XXX
      // mesh.geometry.groups[0].materialIndex = 1;
      /* mesh.geometry.groups = [
        {
          start: 0,
          count: uvs.array.length,
          materialIndex: 0
        }
      ]; */
      /* if (self.useTransparency && self.transparents.indexOf(faceMaterial) !== -1) {
        throw new Error('was transparent');
      } */

      // pass texture start in UV coordinates

      // WARNING: ugly hack ahead. because I don't know how to pass per-geometry uniforms
      // to custom shaders using three.js (https://github.com/deathcap/voxel-texture-shader/issues/3),
      // I'm (ab)using faceVertexUvs = the 'uv' attribute: it is the same for all coordinates,
      // and the fractional part is the top-left UV, the whole part is the tile size.

      /* var tileSizeX = bottomUV[0] - topUV[0];
      var tileSizeY = topUV[1] - bottomUV[1];

      // integer
      var tileSizeIntX = tileSizeX * self.canvas.width;
      var tileSizeIntY = tileSizeY * self.canvas.height;
      // half because of four-tap repetition
      tileSizeIntX /= 2;
      tileSizeIntY /= 2;

      var isInteger = function(n) { return round(n) === n; }; // Number.isInteger :(
      if (!isInteger(tileSizeIntX) || !isInteger(tileSizeIntY)) {
        throw new Error('voxel-plane-shader tile dimensions non-integer '+tileSizeIntX+','+tileSizeIntY);
      } */

      // range of UV coordinates for this texture (see above diagram)
      const topUV = atlasuv[0];
      const rightUV = atlasuv[1];
      const bottomUV = atlasuv[2];
      const leftUV = atlasuv[3];

      // set uvs
      const uvIndex = i * 2 * 3 * 2;
      const uvOrder = (i % 2 === 1) ?
        /*
         TOP RIGHT
         LEFT BOTTOM
        */
        [ topUV, leftUV, rightUV, leftUV, bottomUV, rightUV ]
      :
        /*
         RIGHT TOP
         BOTTOM LEFT
        */
        [ rightUV, bottomUV, topUV, bottomUV, leftUV, topUV ];
      // abd
      uvs.array[uvIndex + 0] = uvOrder[0][0];
      uvs.array[uvIndex + 1] = 1.0 - uvOrder[0][1];

      uvs.array[uvIndex + 2] = uvOrder[1][0];
      uvs.array[uvIndex + 3] = 1.0 - uvOrder[1][1];

      uvs.array[uvIndex + 4] = uvOrder[2][0];
      uvs.array[uvIndex + 5] = 1.0 - uvOrder[2][1];

      // bcd
      uvs.array[uvIndex + 6] = uvOrder[3][0];
      uvs.array[uvIndex + 7] = 1.0 - uvOrder[3][1];

      uvs.array[uvIndex + 8] = uvOrder[4][0];
      uvs.array[uvIndex + 9] = 1.0 - uvOrder[4][1];

      uvs.array[uvIndex + 10] = uvOrder[5][0];
      uvs.array[uvIndex + 11] = 1.0 - uvOrder[5][1];
    }

    mesh.geometry.uvsNeedUpdate = true;
  }
};

voxelPlaneShader.prototype.sprite = function(name, w, h, cb) {
  var self = this;
  if (typeof w === 'function') { cb = w; w = null; }
  if (typeof h === 'function') { cb = h; h = null; }
  w = w || 16; h = h || w;
  self.loading++;
  self.artPacks.getTextureImage(name, function(img) {
    var canvases = [];
    for (var x = 0; x < img.width; x += w) {
      for (var y = 0; y < img.height; y += h) {
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.name = name + '_' + x + '_' + y;
        canvas.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h);
        canvases.push(canvas);
      }
    }
    var textures = [];
    each(canvases, function(canvas, next) {
      var tex = new Image();
      tex.name = canvas.name;
      tex.src = canvas.toDataURL();
      tex.onload = function() {
        self.pack(tex, next);
      };
      tex.onerror = next;
      textures.push([
        tex.name, tex.name, tex.name,
        tex.name, tex.name, tex.name
      ]);
    }, function() {
      self._afterLoading();
      canvases = [];
      self.materials = self.materials.concat(textures);
      cb(textures);
    });
  }, function(err, img) {
    cb();
  });
  return self;
};

/* voxelPlaneShader.prototype.animate = function(mesh, names, delay) {
  var self = this;
  delay = delay || 1000;
  if (!Array.isArray(names) || names.length < 2) return false;
  var i = 0;
  var mat = new this.THREE.ShaderMaterial(this.materialParams);
  mat.map = this.texture;
  mat.transparent = true;
  mat.needsUpdate = true;
  tic.interval(function() {
    self.paint(mesh, names[i % names.length]);
    i++;
  }, delay);
  return mat;
};

voxelPlaneShader.prototype.tick = function(dt) {
  tic.tick(dt);
}; */

function each(arr, it, done) {
  var count = 0;
  arr.forEach(function(a) {
    it(a, function() {
      count++;
      if (count >= arr.length) done();
    });
  });
}
