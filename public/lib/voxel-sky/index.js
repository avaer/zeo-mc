var traj = require('voxel-trajectory');
// var tic = require('tic')();

function Sky(opts) {
  var self = this;
  if (opts.THREE) opts = {game:opts};
  this.game   = opts.game;
  this.time   = opts.time  || 0;
  this.size   = opts.size  || this.game.worldWidth() * 3;
  this._color = opts.color || new this.game.THREE.Color(0, 0, 0);
  this._speed = opts.speed || 0.1;
}

module.exports = function(opts) {
  var sky = new Sky(opts || {});
  sky.createBox();
  sky.createLights();
  return function(fn) {
    /* if (typeof fn === 'function') sky.fn = fn;
    else if (typeof fn === 'number') {
      // move to the specific time of day
      sky.time = fn;
      for (var i = 0; i <= 2400; i += sky._speed) sky.tick.call(sky);
    }
    return sky.tick.bind(sky); */
    sky.tick(fn);
  }
};
module.exports.Sky = Sky;

Sky.prototype.tick = function(dt) {
  // tic.tick(dt);
  this.fn.call(this, this.time);
  var pos = this.game.cameraPosition();
  var vec = new this.game.THREE.Vector3(pos[0], pos[1], pos[2]);
  this.outer.position.copy(vec);
  this.inner.position.copy(vec);
  this.ambient.position.copy(vec);
  this.time += this._speed * dt;
  if (this.time > 2400) this.time = 0;
  return this;
};

Sky.prototype.createBox = function() {
  var game = this.game;
  var size = this.size;

  var mat = new game.THREE.MeshBasicMaterial({
    side: game.THREE.BackSide,
    fog: false,
  });
  this.outer = new game.THREE.Mesh(
    new game.THREE.CubeGeometry(size, size, size),
    new game.THREE.MeshFaceMaterial([
      mat, mat, mat, mat, mat, mat
    ])
  );
  game.scene.add(this.outer);

  var materials = [];
  for (var i = 0; i < 6; i++) {
    materials.push(this.createCanvas());
  }
  this.inner = new game.THREE.Mesh(
    new game.THREE.CubeGeometry(size-10, size-10, size-10),
    new game.THREE.MeshFaceMaterial(materials)
  );
  game.scene.add(this.inner);
};

Sky.prototype.createLights = function() {
  var game = this.game;
  this.ambient = new game.THREE.HemisphereLight(0x408CFF, 0xFFC880, 0.6);
  game.scene.add(this.ambient);
  this.sunlight = new game.THREE.DirectionalLight(0xffffff, 0.5);
  game.scene.add(this.sunlight);
};

Sky.prototype.color = function(start, end, dt) {
  var self = this;
  // if (self._colorInterval) self._colorInterval();
  // var i = 0;
  // var start = self._color.clone().getHSL();
  // var color = self._color.clone().getHSL();
  // self._colorInterval = tic.interval(function() {
    // var dt = i / time;
    // start = new game.THREE.Color(start);
    // end = new game.THREE.Color(end);
    start = new game.THREE.Color(start);
    end = new game.THREE.Color(end);
    var color = new game.THREE.Color();
    ['r','g','b'].forEach(function(p) { color[p] = start[p] + (end[p] - start[p]) * dt; });
    self._color.setRGB(color.r, color.g, color.b);

    // console.log('outer', end, time, dt, color);

    self.outer.material.materials.forEach(function(mat) {
      mat.color.setRGB(color.r, color.g, color.b);
    });
    self.ambient.color.setRGB(color.r, color.g, color.b);
    if (self.game.scene.fog) self.game.scene.fog.color.setRGB(color.r, color.g, color.b);
    // if (dt === 1) self._colorInterval();
    // i += self._speed;
  // }, self._speed);
};

Sky.prototype.speed = function(speed) {
  if (speed != null) this._speed = speed;
  return this._speed;
};

Sky.prototype.paint = function(faces, fn) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 2);
  var index = ['back', 'front', 'top', 'bottom', 'left', 'right'];
  if (faces === 'all') faces = index;
  if (faces === 'sides') faces = ['back', 'front', 'left', 'right'];
  if (!isArray(faces)) faces = [faces];
  faces.forEach(function(face) {
    if (typeof face === 'string') {
      face = index.indexOf(String(face).toLowerCase());
      if (face === -1) return;
    }
    self.material = self.inner.material.materials[face];
    self.canvas = self.material.map.image;
    self.context = self.canvas.getContext('2d');
    fn.apply(self, args);
    self.inner.material.materials[face].map.needsUpdate = true;
  });
  self.material = self.canvas = self.context = false;
};

Sky.prototype.sun   = require('./lib/sun.js');
Sky.prototype.moon  = require('./lib/moon.js');
Sky.prototype.stars = require('./lib/stars.js');

Sky.prototype.createCanvas = function() {
  var game = this.game;

  var canvas = document.createElement('canvas');
  canvas.height = canvas.width = 512;
  var context = canvas.getContext('2d');

  var material = new game.THREE.MeshBasicMaterial({
    side: game.THREE.BackSide,
    map: new game.THREE.Texture(canvas),
    transparent: true,
    fog: false,
  });
  material.magFilter = game.THREE.NearestFilter;
  material.minFilter = game.THREE.LinearMipMapLinearFilter;
  material.wrapS = material.wrapT = game.THREE.RepeatWrapping;
  material.map.needsUpdate = true;

  return material;
};

Sky.prototype.spin = function(r, axis) {
  axis = axis || 'z';
  this.inner.rotation[axis] = this.outer.rotation[axis] = r;
  this.ambient.rotation[axis] = r + Math.PI;
  var t = traj(this.size/2, this.ambient.rotation);
  this.sunlight.position.set(t[0], t[1], t[2]);
  this.sunlight.lookAt(0, 0, 0);
};

Sky.prototype.clear = function() {
  if (!this.canvas) return false;
  this.context.fillStyle = 'black';
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// default sky
Sky.prototype._default = {
  hours: {
       0: {color: 0x000000},
     200: {color: 0x000000},
     600: {color: 0xA67A59},
     800: {color: 0x9CA3C9},
    1600: {color: 0x9CA3C9},
    // 1600: {color: 0x000000},
    1800: {color: 0xA67A59},
    2200: {color: 0x000000},
    2400: {color: 0x000000},
       /* 0: {color: {h: 230/360, s: 0.3, l: 0}},
     300: {color: {h: 26/360, s: 0.3, l: 0.5}},
     500: {color: {h: 230/360, s: 0.3, l: 0.7}},
    1400: {color: {h: 26/360, s: 0.3, l: 0.5}},
    1600: {color: {h: 230/360, s: 0.3, l: 0}},
    2400: {color: {h: 230/360, s: 0.3, l: 0}}, */
  },
  init: function() {
    // add a sun on the bottom
    this.paint('bottom', this.sun);
    // add some stars
    this.paint(['top', 'left', 'right', 'front', 'back'], this.stars, 500);
    // add full moon to the top
    this.paint('top', this.moon, 0);
    // no sunlight at startup
    this.sunlight.intensity = 0;
  },
  day: 0,
  moonCycle: 29.5305882,
  until: false,
  last: 0
};

// default sky fn
Sky.prototype.fn = function(time) {
  var my = this._default;
  // var hour = Math.round(time / 100) * 100;
  var hour = time;
  var speed = Math.abs(my.last - time);
  my.last = time;

  // run initialization once
  if (my.init) { my.init.call(this); delete my.init; }

  // switch color based on time of day
  // maybe make this next part into a helper function
  if (my.hours) {
    var hours = my.hours;
    var allHours = Object.keys(hours).map(function(s) {return Number(s);});
    var prevHourIndex = (function() {
      for (var i = 0; i < allHours.length - 2; i++) {
        if (allHours[i + 1] > hour) {
          break;
        }
      }
      return i;
    })();
    var prevHour = allHours[prevHourIndex];
    var nextHourIndex = prevHourIndex + 1;
    var nextHour = allHours[nextHourIndex];
    var dt = (hour - prevHour) / (nextHour - prevHour);
    this.color(hours[prevHour].color, hours[nextHour].color, dt);
  }

  // change moon phase
  if (time === 1200) {
    this.paint('top', this.clear);
    this.paint('top', this.moon, Math.floor(my.day % my.moonCycle) / my.moonCycle);
    this.paint('top', this.stars, 500);
  }

  // fade stars in and out
  if (time >= 500 && time <= 600) {
    this.paint(['top', 'left', 'right', 'front', 'back'], function() {
      this.material.transparent = true;
      // var i = tic.interval(function(mat) {
        this.material.opacity = 1 - ((time - 500) / (600 - 500));
        // if (mat.opacity <= 0) i();
      // }, 100, this.material);
    });
  }
  if (time >= 1800 && time <= 1900) {
    this.paint(['top', 'left', 'right', 'front', 'back'], function() {
      this.material.transparent = true;
      // var i = tic.interval(function(mat) {
        this.material.opacity = (time - 1800) / (1900 - 1800);
        // if (mat.opacity >= 1) i();
      // }, 100, this.material);
    });
  }

  // turn on sunlight
  if (time >= 400 && time <= 500) {
    // (function(sunlight) {
      // var i = tic.interval(function() {
        this.sunlight.intensity = (time - 400) / (500 - 400);
        // if (sunlight.intensity <= 1) i();
      // }, 100);
    // }(this.sunlight));
  }

  // turn off sunlight
  if (time >= 1800 && time <= 1900) {
    // (function(sunlight) {
      // var i = tic.interval(function() {
        // sunlight.intensity -= 0.1;
        this.sunlight.intensity = 1 - ((time - 1800) / (1900 - 1800));
      // }, 100);
    // }(this.sunlight));
  }

  // spin the sky 1 revolution per day
  this.spin(Math.PI * 2 * (time / 2400));

  // keep track of days
  if (time === 2400) my.day++;
};

Sky.prototype.rgba = function(c, o) {
  if (arguments.length === 4) {
    c = {r: arguments[0], g: arguments[1], b: arguments[2]};
    o = arguments[3];
  }
  return 'rgba(' + (c.r*255) + ', ' + (c.g*255) + ', ' + (c.b*255) + ', ' + o + ')';
};

function isArray(ar) {
  return Array.isArray(ar)
    || (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}
