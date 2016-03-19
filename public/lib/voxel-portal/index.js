const SIZE = 1;

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 512;

const portalShader = {

  uniforms: {
    /* diffuseColor: {
      type: "c",
      value: new THREE.Color(0xffdea2)
    }, */
    diffuseSampler: {
      type: "t",
      value: null
    }

  },

  vertexShader: [

    "varying vec4 texCoord;",

    "void main() {",

    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "texCoord = projectionMatrix * mvPosition;",
    // "texCoord.x *= -1.0;",
    "texCoord.xy = 0.5*texCoord.xy + 0.5*texCoord.w;",

    "gl_Position = projectionMatrix * mvPosition;",
    "}"

  ].join("\n"),

  fragmentShader: [

    // "uniform vec3 diffuseColor;",
    "uniform sampler2D diffuseSampler;",

    "varying vec4 texCoord;",

    "void main() {",

    "vec4 uv = texCoord;",
    /* "vec4 color = vec4(diffuseColor, 1.0);",
    "color = texture2DProj(diffuseSampler, uv);",
    "color = color * vec4(diffuseColor, 1.0) + vec4(diffuseColor, 1.0) * 0.1;", */

    "vec4 color = texture2DProj(diffuseSampler, uv);",

    "gl_FragColor = color;",
    "}"

  ].join("\n")

};

function VoxelPortal(game) {
  const {scene, camera, THREE} = game;
  const {width, height} = game;

  const targets = {
    red1: _makeRenderTarget(THREE),
    red2: _makeRenderTarget(THREE),
    blue1: _makeRenderTarget(THREE),
    blue2: _makeRenderTarget(THREE),
  };

  const redPortalMesh = _makePortalMesh({texture: targets.blue2}, THREE);
  redPortalMesh.position.set(0, 14, -4);
  scene.add(redPortalMesh);
  const bluePortalMesh = _makePortalMesh({texture: targets.red2}, THREE);
  bluePortalMesh.position.set(-3, 14, -2);
  bluePortalMesh.rotation.set(0, Math.PI / 2, 0);
  scene.add(bluePortalMesh);

  const portalRenderers = [
    _makePortalRenderer(redPortalMesh, bluePortalMesh, targets.red1, targets.red2, game),
    _makePortalRenderer(bluePortalMesh, redPortalMesh, targets.blue1, targets.blue2, game),
  ];

  this._portalRenderers = portalRenderers;
}
VoxelPortal.prototype = {
  render() {
    const {_portalRenderers: portalRenderers} = this;

    portalRenderers.forEach(portalRenderer => {
      portalRenderer();
    });
  }
};

function _makeRenderTarget(THREE) {
  return new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
  });
}

function _sgn(a) {
  if (a > 0.0) return (1.0);
  if (a < 0.0) return (-1.0);
  return (0.0);
}

function _makePortalRenderer(sourcePortalMesh, targetPortalMesh, target1, target2, game) {
  const {width, height, scene, camera, view, THREE} = game;

  const portalCamera = new THREE.PerspectiveCamera(view.fov, view.aspectRatio, view.nearPlane, view.farPlane);
  portalCamera.matrixAutoUpdate = false;
  camera.add(portalCamera);
window.portalCamera = portalCamera;

  const screenScene = (() => {
    const screenScene = new THREE.Scene();

    const screenGeometry = new THREE.PlaneGeometry(width, height);
    const screenMaterial = new THREE.MeshBasicMaterial({map: target1});
    const quad = new THREE.Mesh(screenGeometry, screenMaterial);
    screenScene.add(quad);

    return screenScene;
  })();

  const screenCamera = (() => {
    const screenCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -10000, 10000);
    screenCamera.position.z = 1;
    return screenCamera;
  })();
  screenScene.add(screenCamera);

  const positionDelta = targetPortalMesh.position.clone().sub(sourcePortalMesh.position);
  const positionDeltaMatrix = new THREE.Matrix4().makeTranslation(positionDelta.x, positionDelta.y, positionDelta.z);
  const rotationDelta = new THREE.Euler().setFromVector3(targetPortalMesh.rotation.toVector3().sub(sourcePortalMesh.rotation.toVector3()));
  const rotationDeltaMatrix = new THREE.Matrix4().makeRotationFromEuler(rotationDelta);
  const deltaMatrix = positionDeltaMatrix.clone().multiply(rotationDeltaMatrix);
  portalCamera.matrix.copy(deltaMatrix);

  function updatePortalCamera() {
    // update portalCamera matrices
    portalCamera.updateProjectionMatrix();
    portalCamera.updateMatrixWorld();
    portalCamera.matrixWorldInverse.getInverse(portalCamera.matrixWorld);

    // reflecting a vector:
    // http://www.3dkingdoms.com/weekly/weekly.php?a=2

    /* // now update projection matrix with new clip plane
    // implementing code from: http://www.terathon.com/code/oblique.html
    // paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf

    // update sourcePortalMesh matrices
    sourcePortalMesh.updateMatrix();

    const rotationMatrix = new THREE.Matrix4().extractRotation(sourcePortalMesh.matrix);
    const N = new THREE.Vector3(0, 0, -1).applyMatrix4(rotationMatrix);

    const clipPlane = new THREE.Plane();
    clipPlane.setFromNormalAndCoplanarPoint(N, sourcePortalMesh.position);
    clipPlane.applyMatrix4(portalCamera.matrixWorldInverse);

    const clipPlane2 = new THREE.Vector4(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.constant);

    const {projectionMatrix} = portalCamera;

    const q = new THREE.Vector4();
    q.x = (_sgn(clipPlane2.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    q.y = (_sgn(clipPlane2.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    q.z = -1.0;
    q.w = (1.0 + projectionMatrix.elements[10]) / portalCamera.projectionMatrix.elements[14];

    // Calculate the scaled plane vector
    const c = new THREE.Vector4().multiplyScalar(2.0 / clipPlane2.dot(q));

    // Replace the third row of the projection matrix
    projectionMatrix.elements[2] = c.x;
    projectionMatrix.elements[6] = c.y;
    projectionMatrix.elements[10] = c.z + 1.0;
    projectionMatrix.elements[14] = c.w; */

  }

  function renderTargets() {
    view.renderer.render(scene, portalCamera, target1, true);
    view.renderer.render(screenScene, screenCamera, target2, true)
  }

  return function() {
    updatePortalCamera();
    renderTargets();
  };
}

function _makePortalMesh(spec, THREE) {
  const {texture} = spec;

  const geometry = (() => {
    const planeGeometry = new THREE.PlaneGeometry(SIZE, SIZE * 2);
    planeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(SIZE / 2, 0, 0));
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(planeGeometry);
    return bufferGeometry;
  })();
  const material = (() => {
    const shaderUniforms = THREE.UniformsUtils.clone(portalShader.uniforms);
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader: portalShader.vertexShader,
      fragmentShader: portalShader.fragmentShader
    });
    shaderMaterial.uniforms.diffuseSampler.value = texture;
    return shaderMaterial;
  })();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function voxelPortal(game) {
  return new VoxelPortal(game);
}

module.exports = voxelPortal;
