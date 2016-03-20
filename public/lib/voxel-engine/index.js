var voxel = require('../voxel/index')
var voxelBlockRenderer = require('../voxel-block-renderer/index')
var voxelPlaneRenderer = require('../voxel-plane-renderer/index')
var voxelModelRenderer = require('../voxel-model-renderer/index')
var voxelRaycast = require('../voxel-raycast/index')
var voxelAsync = require('../voxel-async/index')
var voxelUtils = require('../voxel-utils/index')
var voxelBlockShader = require('../voxel-block-shader/index')
var voxelPlaneShader = require('../voxel-plane-shader/index')
var voxelControl = require('../voxel-control/index')
var voxelView = require('../voxel-view/index')
var THREE = require('three')
var THREECSG = require('three-js-csg');
var Stats = require('./lib/stats')
var Detector = require('./lib/detector')
var inherits = require('inherits')
var path = require('path')
var EventEmitter = require('events').EventEmitter
if (process.browser) var interact = require('interact')
var requestAnimationFrame = require('raf')
var collisions = require('collide-3d-tilemap')
var aabb = require('aabb-3d')
var glMatrix = require('gl-matrix')
var vector = glMatrix.vec3
var SpatialEventEmitter = require('spatial-events')
var regionChange = require('voxel-region-change')
var kb = require('kb-controls')
var physical = require('voxel-physical')
var tic = require('tic')()

var floor = Math.floor;

module.exports = Game

function Game(opts) {
  if (!(this instanceof Game)) return new Game(opts)
  var self = this
  if (!opts) opts = {}
  if (process.browser && this.notCapable(opts)) return
  
  // is this a client or a headless server
  this.isClient = Boolean( (typeof opts.isClient !== 'undefined') ? opts.isClient : process.browser )

  if (!('generateChunks' in opts)) opts.generateChunks = true
  this.generateChunks = opts.generateChunks
  this.setConfigurablePositions(opts)
  this.configureChunkLoading(opts)
  this.setDimensions(opts)
  this.THREE = THREE
  this.THREECSG = THREECSG(THREE);
  this.vector = vector
  this.glMatrix = glMatrix
  this.arrayType = opts.arrayType || Uint8Array
  this.cubeSize = 1 // backwards compat
  this.chunkSize = opts.chunkSize || 32
  this.tickRate = opts.tickRate || 10
  this.tickTime = 1000 / this.tickRate;
  
  // chunkDistance and removeDistance should not be set to the same thing
  // as it causes lag when you go back and forth on a chunk boundary
  this.chunkDistance = opts.chunkDistance || 2
  this.removeDistance = opts.removeDistance || this.chunkDistance + 1
  
  this.skyColor = opts.skyColor || 0xBFD1E5
  this.antialias = opts.antialias
  this.playerHeight = opts.playerHeight || 1.62
  this.meshType = opts.meshType || 'surfaceMesh'
  this.atlas = opts.atlas
  this.textureLoader = opts.textureLoader

  this.items = []
  this.voxels = voxel(this)
  this.voxelUtils = voxelUtils({chunkSize: this.chunkSize})

  this.scene = new THREE.Scene()
  this.view = opts.view || new voxelView(THREE, {
    width: this.width,
    height: this.height,
    skyColor: this.skyColor,
    antialias: this.antialias
  })
  this.view.bindToScene(this.scene)
  this.camera = this.view.getCamera()
  if (!opts.lightsDisabled) this.addLights(this.scene)
  
  this.fogScale = opts.fogScale || 32
  if (!opts.fogDisabled) this.scene.fog = new THREE.Fog( this.skyColor, 0.00025, this.worldWidth() * this.fogScale )
  
  this.collideVoxels = collisions(
    this.getBlock.bind(this),
    1,
    [Infinity, Infinity, Infinity],
    [-Infinity, -Infinity, -Infinity]
  )
  
  this.timer = this.initializeTimer(opts.tickFPS || 16)
  // this.paused = false

  this.spatial = new SpatialEventEmitter
  this.region = regionChange(this.spatial, aabb([0, 0, 0], [1, 1, 1]), this.chunkSize)
  this.voxelRegion = regionChange(this.spatial, 1)
  this.chunkRegion = regionChange(this.spatial, this.chunkSize)
  this.asyncChunkGeneration = false

  // contains chunks that has had an update this tick. Will be generated right before redrawing the frame
  this.chunksNeedsUpdate = {}
  // contains new chunks yet to be generated. Handled by game.loadPendingChunks
  this.pendingChunks = []

  this.blockShader = voxelBlockShader({
    game: this,
    atlas: this.atlas,
    transparent: false
  });
  this.planeShader = voxelPlaneShader({
    game: this,
    atlas: this.atlas
  });
  
  self.chunkRegion.on('change', function(newChunk) {
    self.removeFarChunks()
  })

  if (this.generateChunks) this.handleChunkGeneration()

  // client side only after this point
  if (!this.isClient) return
  
  // this.paused = true
  this.initializeRendering(opts)
 
  this.showAllChunks()

  setTimeout(function() {
    self.asyncChunkGeneration = 'asyncChunkGeneration' in opts ? opts.asyncChunkGeneration : true
  }, 2000)

  this.initializeControls(opts)
}

inherits(Game, EventEmitter)

// # External API

Game.prototype.voxelPosition = function(gamePosition) {
  var p = gamePosition
  var v = []
  v[0] = floor(p[0])
  v[1] = floor(p[1])
  v[2] = floor(p[2])
  return v
}

Game.prototype.cameraPosition = function() {
  return this.view.cameraPosition()
}

Game.prototype.cameraVector = function() {
  return this.view.cameraVector()
}

Game.prototype.makePhysical = function(target, envelope, blocksCreation) {
  var vel = this.terminalVelocity
  envelope = envelope || [2/3, 1.5, 2/3]
  var obj = physical(target, this.potentialCollisionSet(), envelope, {x: vel[0], y: vel[1], z: vel[2]})
  obj.blocksCreation = !!blocksCreation
  return obj
}

Game.prototype.addItem = function(item) {
  if (!item.tick) {
    var newItem = physical(
      item.mesh,
      this.potentialCollisionSet(),
      [item.size, item.size, item.size]
    )
    
    if (item.velocity) {
      newItem.velocity.copy(item.velocity)
      newItem.subjectTo(this.gravity)
    }
    
    newItem.repr = function() { return 'debris' }
    newItem.mesh = item.mesh
    newItem.blocksCreation = item.blocksCreation
    
    item = newItem
  }
  
  this.items.push(item)
  if (item.mesh) this.scene.add(item.mesh)
  return this.items[this.items.length - 1]
}

Game.prototype.removeItem = function(item) {
  var ix = this.items.indexOf(item)
  if (ix < 0) return
  this.items.splice(ix, 1)
  if (item.mesh) this.scene.remove(item.mesh)
}

// only intersects voxels, not items (for now)
Game.prototype.raycast = // backwards compat
Game.prototype.raycastVoxels = function(start, direction, maxDistance, epilson) {
  if (!start) return this.raycastVoxels(this.cameraPosition(), this.cameraVector(), 10)
  
  var hitNormal = [0, 0, 0]
  var hitPosition = [0, 0, 0]
  var cp = start || this.cameraPosition()
  var cv = direction || this.cameraVector()
  var hitBlock = voxelRaycast((x, y, z) => {
    const result = this.getValue(x, y, z);
    return result;
  }, cp, cv, maxDistance || 10.0, hitPosition, hitNormal, epilson || this.epilson)
  if (hitBlock <= 0) return false
  var adjacentPosition = [0, 0, 0]
  var voxelPosition = this.voxelPosition(hitPosition)
  vector.add(adjacentPosition, voxelPosition, hitNormal)
  
  return {
    position: hitPosition,
    voxel: voxelPosition,
    direction: direction,
    value: hitBlock,
    normal: hitNormal,
    adjacent: adjacentPosition
  }
}

Game.prototype.canCreateBlock = function(pos) {
  pos = this.parseVectorArguments(arguments)
  var floored = pos.map(function(i) { return Math.floor(i) })
  var bbox = aabb(floored, [1, 1, 1])
  
  for (var i = 0, len = this.items.length; i < len; ++i) {
    var item = this.items[i]
    var itemInTheWay = item.blocksCreation && item.aabb && bbox.intersects(item.aabb())
    if (itemInTheWay) return false
  }

  return true
}

Game.prototype.createBlock = function(pos, val) {
  if (typeof val === 'string') val = this.blockShader.find(val)
  if (!this.canCreateBlock(pos)) return false
  this.setBlock(pos, val)
  return true
}

Game.prototype.getBlock = function(pos) {
  pos = this.parseVectorArguments(arguments)
  return this.voxels.voxelAtPosition(pos)
}

Game.prototype.setBlock = function(pos, val) {
  if (typeof val === 'string') val = this.blockShader.find(val)
  var old = this.voxels.voxelAtPosition(pos, val)
  var c = this.voxels.chunkAtPosition(pos)
  var chunk = this.voxels.chunks[c.join('|')]
  if (!chunk) return// todo - does self.emit('missingChunk', c.join('|')) make sense here?
  this.addChunkToNextUpdate(chunk)
  this.spatial.emit('change-block', pos, old, val)
  this.emit('setBlock', pos, val, old)
}

Game.prototype.getValue = function(position) {
  position = this.parseVectorArguments(arguments);

  const chunkPos = this.voxels.chunkAtPosition(position);
  const chunkIndex = chunkPos.join('|');
  const chunk = this.voxels.chunks[chunkIndex];
  if (chunk) {
    const index = this.voxelUtils.getIndex(position[0], position[1], position[2]);
    const match = (() => {
      let variant;
      if (variant = chunk.voxels[index]) {
        const type = 'block';
        return {type, variant};
      } else if (variant = chunk.vegetations[index]) {
        const type = 'vegetation';
        return {type, variant};
      } else if (variant = chunk.effects[index]) {
        const type = 'effect';
        return {type, variant};
      } else {
        return null;
      }
    })();
    if (match) {
      const {type, variant: value} = match;
      return {type, value, chunkIndex, index};
    } else {
      return null;
    }
  } else {
    return null;
  }
}

Game.prototype.setValue = function(position, value) {
  position = this.parseVectorArguments(arguments);

  const oldValue = this.getValue(position);
  if (!oldValue) {
    const chunkPos = this.voxels.chunkAtPosition(position);
    const chunkIndex = chunkPos.join('|');
    const chunk = this.voxels.chunks[chunkIndex];
    const mesh = this.voxels.meshes[chunkIndex];
    if (chunk) {
      const {type, value: variant} = value;
      const index = this.voxelUtils.getIndex(position[0], position[1], position[2]);

      if (type === 'block') {
        chunk.voxels[index] = variant;
        mesh.blocksNeedUpdate = true;
      } else if (type === 'vegetation') {
        const x = this.voxelUtils.snapCoordinate(position[0]);
        const y = this.voxelUtils.snapCoordinate(position[1]);
        const z = this.voxelUtils.snapCoordinate(position[2]);
        const variantValue = variant[3];
        chunk.vegetations[index] = [x, y, z, variantValue];
        mesh.planesNeedUpdate = true;
      } else if (type === 'effect') {
        const x = this.voxelUtils.snapCoordinate(position[0]);
        const y = this.voxelUtils.snapCoordinate(position[1]);
        const z = this.voxelUtils.snapCoordinate(position[2]);
        const variantValue = variant[3];
        chunk.effects[index] = [x, y, z, variantValue];
        mesh.planesNeedUpdate = true;
      }
      this.addChunkToNextUpdate(chunk);
    }
  }
}

Game.prototype.deleteValue = function(value) {
  const {type, chunkIndex, index, value: voxelValue} = value;
  const chunk = this.voxels.chunks[chunkIndex];
  const mesh = this.voxels.meshes[chunkIndex];
  if (type === 'block') {
    chunk.voxels[index] = 0;
    mesh.blocksNeedUpdate = true;
  } else if (type === 'vegetation') {
    chunk.vegetations[index] = null;
    mesh.planesNeedUpdate = true;
  } else if (type === 'effect') {
    chunk.effects[index] = null;
    mesh.planesNeedUpdate = true;
  }
  this.addChunkToNextUpdate(chunk);
}

Game.prototype.blockPosition = function(pos) {
  pos = this.parseVectorArguments(arguments)
  var ox = Math.floor(pos[0])
  var oy = Math.floor(pos[1])
  var oz = Math.floor(pos[2])
  return [ox, oy, oz]
}

Game.prototype.blocks = function(low, high, iterator) {
  var l = low, h = high
  var d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ]
  if (!iterator) var voxels = new this.arrayType(d[0]*d[1]*d[2])
  var i = 0
  for(var z=l[2]; z<h[2]; ++z)
  for(var y=l[1]; y<h[1]; ++y)
  for(var x=l[0]; x<h[0]; ++x, ++i) {
    if (iterator) iterator(x, y, z, i)
    else voxels[i] = this.voxels.voxelAtPosition([x, y, z])
  }
  if (!iterator) return {voxels: voxels, dims: d}
}

// backwards compat
Game.prototype.createAdjacent = function(hit, val) {
  this.createBlock(hit.adjacent, val)
}

Game.prototype.appendTo = function (element) {
  this.view.appendTo(element)
}

// # Defaults/options parsing

Game.prototype.gravity = [0, -0.0000036, 0]
Game.prototype.friction = 0.3
Game.prototype.epilson = 1e-8
Game.prototype.terminalVelocity = [0.9, 0.1, 0.9]

Game.prototype.defaultButtons = {
  'W': 'forward',
  'A': 'left',
  'S': 'backward',
  'D': 'right',
  '<up>': 'forward',
  '<left>': 'left',
  '<down>': 'backward',
  '<right>': 'right',
  '<mouse 1>': 'fire',
  '<mouse 3>': 'firealt',
  '<space>': 'jump',
  '<shift>': 'crouch',
  '<control>': 'alt',
  'Q': 'greenapple',
  'E': 'flare',
  'Z': 'portalred',
  'C': 'portalblue',
}

// used in methods that have identity function(pos) {}
Game.prototype.parseVectorArguments = function(args) {
  if (!args) return false
  if (args[0] instanceof Array) return args[0]
  return [args[0], args[1], args[2]]
}

Game.prototype.setConfigurablePositions = function(opts) {
  var sp = opts.startingPosition
  this.startingPosition = sp || [35, 1024, 35]
  var wo = opts.worldOrigin
  this.worldOrigin = wo || [0, 0, 0]
}

Game.prototype.setDimensions = function(opts) {
  if (opts.container) this.container = opts.container
  if (opts.container && opts.container.clientHeight) {
    this.height = opts.container.clientHeight
  } else {
    this.height = typeof window === "undefined" ? 1 : window.innerHeight
  }
  if (opts.container && opts.container.clientWidth) {
    this.width = opts.container.clientWidth
  } else {
    this.width = typeof window === "undefined" ? 1 : window.innerWidth
  }
}

Game.prototype.notCapable = function(opts) {
  var self = this
  if( !Detector().webgl ) {
    this.view = {
      appendTo: function(el) {
        el.appendChild(self.notCapableMessage())
      }
    }
    return true
  }
  return false
}

Game.prototype.notCapableMessage = function() {
  var wrapper = document.createElement('div')
  wrapper.className = "errorMessage"
  var a = document.createElement('a')
  a.title = "You need WebGL and Pointer Lock (Chrome 23/Firefox 14) to play this game. Click here for more information."
  a.innerHTML = a.title
  a.href = "http://get.webgl.org"
  wrapper.appendChild(a)
  return wrapper
}

Game.prototype.onWindowResize = function() {
  var width = window.innerWidth
  var height = window.innerHeight
  if (this.container) {
    width = this.container.clientWidth
    height = this.container.clientHeight
  }
  this.view.resizeWindow(width, height)
}

// # Physics/collision related methods

Game.prototype.control = function(target) {
  this.controlling = target
  return this.controls.target(target)
}

Game.prototype.potentialCollisionSet = function() {
  return [{ collide: this.collideTerrain.bind(this) }]
}

/**
 * Get the position of the player under control.
 * If there is no player under control, return
 * current position of the game's camera.
 *
 * @return {Array} an [x, y, z] tuple
 */

Game.prototype.playerPosition = function() {
  var target = this.controls.target()
  var position = target
    ? target.avatar.position
    : this.camera.localToWorld(this.camera.position.clone())
  return [position.x, position.y, position.z]
}

Game.prototype.playerAABB = function(position) {
  var pos = position || this.playerPosition()
  var lower = []
  var upper = [1/2, this.playerHeight, 1/2]
  var playerBottom = [1/4, this.playerHeight, 1/4]
  vector.subtract(lower, pos, playerBottom)
  var bbox = aabb(lower, upper)
  return bbox
}

Game.prototype.collideTerrain = function(other, bbox, vec, resting) {
  var self = this
  var axes = ['x', 'y', 'z']
  var vec3 = [vec.x, vec.y, vec.z]
  this.collideVoxels(bbox, vec3, function hit(axis, tile, coords, dir, edge) {
    if (!tile) return false
    if (Math.abs(vec3[axis]) < Math.abs(edge)) return false

    if (axis === 2 && dir === -1) {
      console.log('collide z = -1', coords);
    } else if (axis === 0 && dir === -1) {
      console.log('collide x = -1', coords);
    } else if (axis === 2 && dir === 1) {
      console.log('collide z = 1', coords);
    } else if (axis === 0 && dir === 1) {
      console.log('collide x = 1', coords);
    }

    vec3[axis] = vec[axes[axis]] = edge
    other.acceleration[axes[axis]] = 0
    resting[axes[axis]] = dir
    other.friction[axes[(axis + 1) % 3]] = other.friction[axes[(axis + 2) % 3]] = axis === 1 ? self.friction  : 1
    return true
  })
}

// # Three.js specific methods

Game.prototype.addStats = function() {
  this.stats = new Stats()
  this.stats.domElement.style.position  = 'absolute'
  this.stats.domElement.style.bottom  = '0px'
  document.body.appendChild( this.stats.domElement )
}

Game.prototype.addLights = function(scene) {
  const ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 0.5).normalize();
  scene.add(directionalLight);
}

// # Chunk related methods

Game.prototype.configureChunkLoading = function(opts) {
  var self = this
  if (!opts.generateChunks) return
  if (!opts.generate) {
    this.generate = function(x,y,z) {
      return x*x+y*y+z*z <= 15*15 ? 1 : 0 // sphere world
    }
  } else {
    this.generate = opts.generate
  }
  if (opts.generateVoxelChunk) {
    this.generateVoxelChunk = opts.generateVoxelChunk
  } else {
    this.generateVoxelChunk = function(low, high) {
      return voxel.generate(low, high, self.generate, self)
    }
  }
}

Game.prototype.worldWidth = function() {
  return this.chunkSize * 2 * this.chunkDistance
}

Game.prototype.chunkToWorld = function(pos) {
  return [
    pos[0] * this.chunkSize,
    pos[1] * this.chunkSize,
    pos[2] * this.chunkSize
  ]
}

Game.prototype.removeFarChunks = function(playerPosition) {
  var self = this
  playerPosition = playerPosition || this.playerPosition()
  var nearbyChunks = this.voxels.nearbyChunks(playerPosition, this.removeDistance).map(function(chunkPos) {
    return chunkPos.join('|')
  })
  Object.keys(self.voxels.chunks).map(function(chunkIndex) {
    if (nearbyChunks.indexOf(chunkIndex) > -1) return
    var chunk = self.voxels.chunks[chunkIndex]
    var mesh = self.voxels.meshes[chunkIndex]
    var pendingIndex = self.pendingChunks.indexOf(chunkIndex)
    if (pendingIndex !== -1) self.pendingChunks.splice(pendingIndex, 1)
    if (!chunk) return
    var chunkPosition = chunk.position
    if (mesh) {
      self.scene.remove(mesh);
      self.voxels.meshes[chunkIndex] = null;
    }
    self.voxels.chunks[chunkIndex] = null;
    self.emit('removeChunk', chunkPosition)
  })
  self.voxels.requestMissingChunks(playerPosition)
}

Game.prototype.addChunkToNextUpdate = function(chunk) {
  this.chunksNeedsUpdate[chunk.position.join('|')] = chunk
}

Game.prototype.updateDirtyChunks = function() {
  var self = this
  Object.keys(this.chunksNeedsUpdate).forEach(function showChunkAtIndex(chunkIndex) {
    var chunk = self.chunksNeedsUpdate[chunkIndex]
    self.emit('dirtyChunkUpdate', chunk)
    self.showChunk(chunk)
  })
  this.chunksNeedsUpdate = {}
}

Game.prototype.loadPendingChunks = function(count) {
  var pendingChunks = this.pendingChunks

  if (!this.asyncChunkGeneration) {
    count = pendingChunks.length
  } else {
    count = count || (pendingChunks.length * 0.1)
    count = Math.max(1, Math.min(count, pendingChunks.length))
  }

  for (var i = 0; i < count; i += 1) {
    var chunkPos = pendingChunks[i].split('|')
    var chunk = this.voxels.generateChunk(chunkPos[0]|0, chunkPos[1]|0, chunkPos[2]|0)

    if (this.isClient) this.showChunk(chunk)
  }

  if (count) pendingChunks.splice(0, count)
}

Game.prototype.getChunkAtPosition = function(pos) {
  var chunkID = this.voxels.chunkAtPosition(pos).join('|')
  var chunk = this.voxels.chunks[chunkID]
  return chunk
}

Game.prototype.showAllChunks = function() {
  for (var chunkIndex in this.voxels.chunks) {
    this.showChunk(this.voxels.chunks[chunkIndex])
  }
}

Game.prototype.showChunk = function(chunk) {
  const chunkIndex = chunk.position.join('|');

  const {THREE} = this;

  let mesh = this.voxels.meshes[chunkIndex];
  const hadOldMesh = !!mesh;
  if (!mesh) {
    mesh = new THREE.Object3D();

    mesh.blockMesh = null;
    mesh.planeMesh = null;
    mesh.modelMesh = null;

    mesh.blocksNeedUpdate = true;
    mesh.planesNeedUpdate = true;
    mesh.modelsNeedUpdate = true;

    const bounds = this.voxels.getBounds(chunk.position[0], chunk.position[1], chunk.position[2]);
    mesh.position.set(bounds[0][0], bounds[0][1], bounds[0][2]);
  }

  const {blocksNeedUpdate, planesNeedUpdate, modelsNeedUpdate} = mesh;

  const worldTick = this.getWorldTick();

  if (blocksNeedUpdate) {
    const blockMesh = (() => {
      const blockMesh = voxelBlockRenderer(chunk, this.atlas, THREE);
      if (blockMesh) {
        blockMesh.material = this.blockShader.material;
        return blockMesh;
      } else {
        return null;
      }
    })();
    if (mesh.blockMesh) {
      mesh.remove(mesh.blockMesh);
    }
    if (blockMesh) {
      mesh.add(blockMesh);
      mesh.blockMesh = blockMesh;
    } else {
      mesh.blockMesh = null;
    }
    mesh.blocksNeedUpdate = false;
  }

  if (planesNeedUpdate) {
    const planeMesh = (() => {
      const planeMesh = voxelPlaneRenderer(chunk, this.atlas, THREE);
      if (planeMesh) {
        planeMesh.material = this.planeShader.material;
        return planeMesh;
      } else {
        return null;
      }
    })();
    if (mesh.planeMesh) {
      mesh.remove(mesh.planeMesh);
    }
    if (planeMesh) {
      mesh.add(planeMesh);
      mesh.planeMesh = planeMesh;
    } else {
      mesh.planeMesh = null;
    }
    mesh.planesNeedUpdate = false;
  }

  if (modelsNeedUpdate) {
    const modelMesh = voxelModelRenderer(chunk, this.textureLoader, THREE);
    mesh.add(modelMesh);
    mesh.modelMesh = modelMesh;
  }

  voxelAsync.clearMeshCache(chunk);

  this.voxels.chunks[chunkIndex] = chunk;
  this.voxels.meshes[chunkIndex] = mesh;

  if (!hadOldMesh) {
    this.scene.add(mesh);
  }

  this.emit('renderChunk', chunk);

  return mesh;
}

// # Debugging methods

Game.prototype.addMarker = function(position) {
  var geometry = new THREE.SphereGeometry( 0.1, 10, 10 )
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } )
  var mesh = new THREE.Mesh( geometry, material )
  mesh.position.copy(position)
  this.scene.add(mesh)
}

Game.prototype.addAABBMarker = function(aabb, color) {
  var geometry = new THREE.CubeGeometry(aabb.width(), aabb.height(), aabb.depth())
  var material = new THREE.MeshBasicMaterial({ color: color || 0xffffff, wireframe: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(aabb.x0() + aabb.width() / 2, aabb.y0() + aabb.height() / 2, aabb.z0() + aabb.depth() / 2)
  this.scene.add(mesh)
  return mesh
}

Game.prototype.addVoxelMarker = function(x, y, z, color) {
  var bbox = aabb([x, y, z], [1, 1, 1])
  return this.addAABBMarker(bbox, color)
}

// # Misc internal methods

Game.prototype.onControlChange = function(gained, stream) {
  // this.paused = false

  if (!gained && !this.optout) {
    this.buttons.disable()
    return
  }

  this.buttons.enable()
  stream.pipe(this.controls.createWriteRotationStream())
}

Game.prototype.onControlOptOut = function() {
  this.optout = true
}

Game.prototype.onFire = function(state) {
  this.emit('fire')
}

Game.prototype.onHold = function(item) {
  this.emit('hold', item)
}

Game.prototype.setInterval = tic.interval.bind(tic)
Game.prototype.setTimeout = tic.timeout.bind(tic)

Game.prototype.tick = function(delta, oldWorldTime, newWorldTime) {
  for(var i = 0, len = this.items.length; i < len; ++i) {
    this.items[i].tick(delta)
  }

  const oldWorldTick = this.getWorldTick(oldWorldTime);
  const newWorldTick = this.getWorldTick(newWorldTime);
  if (newWorldTick !== oldWorldTick) {
    this.blockShader.setFrame(newWorldTick);
    this.planeShader.setFrame(newWorldTick);
  }

  if (this.pendingChunks.length) this.loadPendingChunks()
  if (Object.keys(this.chunksNeedsUpdate).length > 0) this.updateDirtyChunks()
  
  tic.tick(delta)

  this.emit('tick', delta)
  
  if (!this.controls) return
  var playerPos = this.playerPosition()
  this.spatial.emit('position', playerPos, playerPos)
}

Game.prototype.render = function(delta) {
  this.emit('prerender');

  this.view.render(this.scene)

  this.emit('postrender');
}

Game.prototype.initializeTimer = function(rate) {
  let self = this;
  let accum = 0;
  let now = 0;
  let last = null;
  let dt = 0;
  let wholeTick;

  self.worldTime = 0;
  self.frameUpdated = true;
  self.interval = setInterval(timer, 0);
  return self.interval;
  
  function timer() {
    /* if (self.paused) {
      last = Date.now();
      accum = 0;
      return;
    } */
    now = Date.now()
    dt = now - (last || now)
    last = now
    accum += dt
    if (accum < rate) return
    wholeTick = ((accum / rate)|0)
    if (wholeTick <= 0) return
    wholeTick *= rate
    
    const oldWorldTime = self.worldTime;
    const newWorldTime = self.worldTime + wholeTick;
    self.worldTime = newWorldTime;

    self.tick(wholeTick, oldWorldTime, newWorldTime);
    accum -= wholeTick;
    
    self.frameUpdated = true;
  }
}

Game.prototype.getWorldTick = function(worldTime) {
  worldTime === undefined && ({worldTime} = this);

  const worldTick = floor(worldTime / this.tickTime);
  return worldTick;
}

Game.prototype.initializeRendering = function(opts) {
  var self = this

  if (!opts.statsDisabled) self.addStats()

  window.addEventListener('resize', self.onWindowResize.bind(self), false)

  requestAnimationFrame(window).on('data', function(dt) {
    self.emit('prerender', dt)
    self.render(dt)
    self.emit('postrender', dt)
  })
  if (typeof stats !== 'undefined') {
    self.on('postrender', function() {
      self.stats.update()
    })
  }
}

Game.prototype.initializeControls = function(opts) {
  // player control
  this.keybindings = opts.keybindings || this.defaultButtons
  this.buttons = kb(document.body, this.keybindings)
  this.buttons.disable()
  this.optout = false
  this.interact = interact(opts.interactElement || this.view.element, opts.interactMouseDrag)
  this.interact
      .on('attain', this.onControlChange.bind(this, true))
      .on('release', this.onControlChange.bind(this, false))
      .on('opt-out', this.onControlOptOut.bind(this))
  this.hookupControls(this.buttons, opts)
}

Game.prototype.hookupControls = function(buttons, opts) {
  opts = opts || {}
  opts.controls = opts.controls || {}
  opts.controls.onfire = this.onFire.bind(this)
  opts.controls.onhold = this.onHold.bind(this)
  opts.controls.discreteFire = true
  this.controls = voxelControl(buttons, opts.controls)
  this.items.push(this.controls)
  this.controlling = null
}

Game.prototype.handleChunkGeneration = function() {
  var self = this
  this.voxels.on('missingChunk', function(chunkPos) {
    self.pendingChunks.push(chunkPos.join('|'))
  })
  this.voxels.requestMissingChunks(this.worldOrigin)
  this.loadPendingChunks(this.pendingChunks.length)
}

// teardown methods
Game.prototype.destroy = function() {
  clearInterval(this.timer)
}
