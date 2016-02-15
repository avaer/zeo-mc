var voxelAsync = require('../voxel-async/index');

module.exports = function(data, THREE) {
  return new VoxelBlockRenderer(data, THREE);
}

module.exports.VoxelBlockRenderer = VoxelBlockRenderer;

function VoxelBlockRenderer(data, THREE) {
  this.data = data
  this.THREE = THREE;

  this.initBlocks();
}

VoxelBlockRenderer.prototype.initBlocks = function() {
  this.blocks = voxelAsync.blockMesher(this.data.voxels, this.data.dims)

  this.geometry = new this.THREE.Geometry()

  this.geometry.vertices.length = 0
  this.geometry.faces.length = 0

  for (var i = 0; i < this.blocks.vertices.length; ++i) {
    var q = this.blocks.vertices[i]
    this.geometry.vertices.push(new this.THREE.Vector3(q[0], q[1], q[2]))
  } 
  
  for (var i = 0; i < this.blocks.faces.length; i++) {
    var q = this.blocks.faces[i]

    var f = new this.THREE.Face3(q[0], q[1], q[2])
    f.color = new this.THREE.Color(q[3])

    this.geometry.faces.push(f)
  }
  for (var i = 0, l = this.blocks.faces.length / 2; i < l; i++) {
    var faceVertexUvs = this.faceVertexUv(i);
    this.geometry.faceVertexUvs[0].push([faceVertexUvs[0], faceVertexUvs[1], faceVertexUvs[3]]);
    this.geometry.faceVertexUvs[0].push([faceVertexUvs[1], faceVertexUvs[2], faceVertexUvs[3]]);
  }
  
  this.geometry.computeFaceNormals()

  // compute vertex colors for ambient occlusion
  var light = new THREE.Color(0xffffff)
  var shadow = new THREE.Color(0x505050)
  for (var i = 0; i < this.geometry.faces.length; ++i) {
    var face = this.geometry.faces[i]
    // facing up
    if (face.normal.y === 1)       face.vertexColors = [light, light, light, light]
    // facing down
    else if (face.normal.y === -1) face.vertexColors = [shadow, shadow, shadow, shadow]
    // facing right
    else if (face.normal.x === 1)  face.vertexColors = [shadow, light, light, shadow]
    // facing left
    else if (face.normal.x === -1) face.vertexColors = [shadow, shadow, light, light]
    // facing backward
    else if (face.normal.z === 1)  face.vertexColors = [shadow, shadow, light, light]
    // facing forward
    else                           face.vertexColors = [shadow, light, light, shadow]
  }

  /* this.geometry.verticesNeedUpdate = true
  this.geometry.elementsNeedUpdate = true
  this.geometry.normalsNeedUpdate = true

  this.geometry.computeBoundingBox()
  this.geometry.computeBoundingSphere() */

  const bufferGeometry = new this.THREE.BufferGeometry().fromGeometry(this.geometry); // XXX clean this up to instantiate BufferGeometry directly
  this.geometry = bufferGeometry;
};

function _getIndex(x, y, z, dims) {
  return x + (y * dims[0]) + (z * dims[0] * dims[1]);
}

VoxelBlockRenderer.prototype.createWireMesh = function(hexColor) {
  var wireMaterial = new this.THREE.MeshBasicMaterial({
    color : hexColor || 0xffffff,
    wireframe : true
  })
  wireMesh = new THREE.Mesh(this.geometry, wireMaterial)
  wireMesh.doubleSided = true
  this.wireMesh = wireMesh
  return wireMesh
}

VoxelBlockRenderer.prototype.createSurfaceMesh = function(material) {
  material = material || new this.THREE.MeshNormalMaterial()
  var surfaceMesh  = new this.THREE.Mesh( this.geometry, material )
  surfaceMesh.doubleSided = false
  this.surfaceMesh = surfaceMesh
  return surfaceMesh
}

VoxelBlockRenderer.prototype.addToScene = function(scene) {
  if (this.wireMesh) scene.add( this.wireMesh )
  if (this.surfaceMesh) scene.add( this.surfaceMesh )
}

VoxelBlockRenderer.prototype.removeFromScene = function(scene) {
  if (this.wireMesh) scene.remove( this.wireMesh )
  if (this.surfaceMesh) scene.remove( this.surfaceMesh )
}

VoxelBlockRenderer.prototype.setPosition = function(x, y, z) {
  if (this.wireMesh) this.wireMesh.position.set(x, y, z)
  if (this.surfaceMesh) this.surfaceMesh.position.set(x, y, z)
}

VoxelBlockRenderer.prototype.faceVertexUv = function(i) {
  var vs = [
    this.blocks.vertices[i*4+0],
    this.blocks.vertices[i*4+1],
    this.blocks.vertices[i*4+2],
    this.blocks.vertices[i*4+3]
  ]
  var spans = {
    x0: vs[0][0] - vs[1][0],
    x1: vs[1][0] - vs[2][0],
    y0: vs[0][1] - vs[1][1],
    y1: vs[1][1] - vs[2][1],
    z0: vs[0][2] - vs[1][2],
    z1: vs[1][2] - vs[2][2]
  }
  var size = {
    x: Math.max(Math.abs(spans.x0), Math.abs(spans.x1)),
    y: Math.max(Math.abs(spans.y0), Math.abs(spans.y1)),
    z: Math.max(Math.abs(spans.z0), Math.abs(spans.z1))
  }
  if (size.x === 0) {
    if (spans.y0 > spans.y1) {
      var width = size.y
      var height = size.z
    }
    else {
      var width = size.z
      var height = size.y
    }
  }
  if (size.y === 0) {
    if (spans.x0 > spans.x1) {
      var width = size.x
      var height = size.z
    }
    else {
      var width = size.z
      var height = size.x
    }
  }
  if (size.z === 0) {
    if (spans.x0 > spans.x1) {
      var width = size.x
      var height = size.y
    }
    else {
      var width = size.y
      var height = size.x
    }
  }
  if ((size.z === 0 && spans.x0 < spans.x1) || (size.x === 0 && spans.y0 > spans.y1)) {
    return [
      new this.THREE.Vector2(height, 0),
      new this.THREE.Vector2(0, 0),
      new this.THREE.Vector2(0, width),
      new this.THREE.Vector2(height, width)
    ]
  } else {
    return [
      new this.THREE.Vector2(0, 0),
      new this.THREE.Vector2(0, height),
      new this.THREE.Vector2(width, height),
      new this.THREE.Vector2(width, 0)
    ]
  }
}
;
