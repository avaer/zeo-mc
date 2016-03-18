function VoxelPortal(game) {
  const {scene, camera, THREE} = game;
  const {width, height} = game;

  const target1 = new THREE.WebGLRenderTarget(width, height, {
    // minFilter: THREE.LinearFilter,
    // magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
  });
  const target2 = new THREE.WebGLRenderTarget(width, height, {
    // minFilter: THREE.LinearFilter,
    // magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
  });
  const screenScene = new THREE.Scene();
	const screenCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -10000, 10000);
	screenCamera.position.z = 1;
	screenScene.add(screenCamera);
	const screenGeometry = new THREE.PlaneGeometry(width, height);
  const screenMaterial = new THREE.MeshBasicMaterial({map: target1});
  const quad = new THREE.Mesh(screenGeometry, screenMaterial);
	screenScene.add(quad);

  const redPortalMesh = _makePortalMesh({map: target2}, THREE);
  redPortalMesh.position.set(0, 14, -4);
  scene.add(redPortalMesh);
  const bluePortalMesh = _makePortalMesh({map: target2}, THREE);
  bluePortalMesh.position.set(-3, 14, -2);
  bluePortalMesh.rotation.set(0, Math.PI / 2, 0);
  scene.add(bluePortalMesh);

  this._game = game;
  this._target1 = target1;
  this._target2 = target2;
  this._screenScene = screenScene;
  this._screenCamera = screenCamera;
}
VoxelPortal.prototype = {
  render() {
    const {_game: game, _target1: target1, _target2: target2, _screenScene: screenScene, _screenCamera: screenCamera} = this;
    const {scene, camera, view} = game;

    view.renderer.render(scene, camera, target1, true);
    view.renderer.render(screenScene, screenCamera, target2, true);
  }
};

function _makePortalMesh(opts, THREE) {
  const geometry = (() => {
    const planeGeometry = new THREE.PlaneGeometry(1, 2);
    planeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0, 0));
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(planeGeometry);
    return bufferGeometry;
  })();
  const material = new THREE.MeshBasicMaterial(opts);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function voxelPortal(game) {
  return new VoxelPortal(game);
}

module.exports = voxelPortal;
