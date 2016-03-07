import voxelPostProcessShader from '../voxel-postprocess-shader/index';

var THREE, temporaryPosition, temporaryVector

module.exports = function(three, opts) {
  temporaryPosition = new three.Vector3
  temporaryVector = new three.Vector3
  
  return new View(three, opts)
}

function View(three, opts) {
  THREE = three // three.js doesn't support multiple instances on a single page
  this.scene = opts.scene
  this.fov = opts.fov || 60
  this.width = opts.width || 512
  this.height = opts.height || 512
  this.devicePixelRatio = opts.devicePixelRatio || 1
  this.aspectRatio = opts.aspectRatio || this.width/this.height
  this.nearPlane = opts.nearPlane || 1
  this.farPlane = opts.farPlane || 10000
  this.skyColor = opts.skyColor || 0xBFD1E5
  this.ortho = opts.ortho
  this.camera = this.ortho?(new THREE.OrthographicCamera(this.width/-2, this.width/2, this.height/2, this.height/-2, this.nearPlane, this.farPlane)):(new THREE.PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane))
  this.camera.lookAt(new THREE.Vector3(0, 0, 0))

  this.scene.add(this.camera);

  // if (!process.browser) return

  this.renderer = null
  this.postProcessShader = null
  this.element = null

  this.init()
}

View.prototype.init = function() {
  this.initRenderer();
  this.initPostProcessShader();
}

View.prototype.initRenderer = function() {
  this.renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  this.renderer.setSize(this.width, this.height)
  this.renderer.setClearColor(new THREE.Color(this.skyColor), 1.0)
  this.renderer.clear()

  this.element = this.renderer.domElement
};

View.prototype.initPostProcessShader = function() {
  this.postProcessShader = voxelPostProcessShader(
    this.renderer,
    this.scene,
    this.camera,
    this.width,
    this.height,
    this.devicePixelRatio,
    [
      /* new voxelPostProcessShader.PASSES.FXAA(this.scene, this.camera, {
        width: this.width,
        height: this.height,
        devicePixelRatio: this.devicePixelRatio
      }), */
      new voxelPostProcessShader.PASSES.Bokeh(this.scene, this.camera, {
        focus: 1.0,
        aperture: 0.025,
        maxblur: 1.0,

        width: this.width,
        height: this.height,
        devicePixelRatio: this.devicePixelRatio
      })
    ]
  );
};

/* View.prototype.bindToScene = function(scene) {
  scene.add(this.camera)
} */

View.prototype.getCamera = function() {
  return this.camera
}

View.prototype.cameraPosition = function() {
  temporaryPosition.multiplyScalar(0)
  temporaryPosition.applyMatrix4(this.camera.matrixWorld)
  return [temporaryPosition.x, temporaryPosition.y, temporaryPosition.z]
}

View.prototype.cameraVector = function() {
  temporaryVector.multiplyScalar(0)
  temporaryVector.z = -1
  temporaryVector.transformDirection(this.camera.matrixWorld)
  return [temporaryVector.x, temporaryVector.y, temporaryVector.z]
}

View.prototype.resizeWindow = function(width, height, devicePixelRatio) {
  if (this.element.parentElement) {
    width = width || this.element.parentElement.clientWidth
    height = height || this.element.parentElement.clientHeight
  }

  this.camera.aspect = this.aspectRatio = width/height
  this.width = width
  this.height = height
  this.devicePixelRatio = devicePixelRatio

  this.camera.updateProjectionMatrix()

  this.renderer.setSize( width, height )
  this.initPostProcessShader();
}

View.prototype.render = function() {
  this.postProcessShader.render();
}

View.prototype.appendTo = function(element) {
  if (typeof element === 'object') {
    element.appendChild(this.element)
  }
  else {
    document.querySelector(element).appendChild(this.element)
  }

  this.resizeWindow(this.width, this.height, this.devicePixelRatio)
}
