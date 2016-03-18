

function voxelPortal(game) {
  const {scene, THREE} = game;

  const redPortalMesh = _makePortalMesh(0xff0000, THREE);
  redPortalMesh.position.set(0, 14, -4);
  scene.add(redPortalMesh);

  const bluePortalMesh = _makePortalMesh(0x0000ff, THREE);
  bluePortalMesh.position.set(-3, 14, -2);
  bluePortalMesh.rotation.set(0, Math.PI / 2, 0);
  scene.add(bluePortalMesh);
}

function _makePortalMesh(color, THREE) {
  const geometry = new THREE.PlaneGeometry(1, 2);
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0.5, 0, 0));
  const material = new THREE.MeshLambertMaterial({color});
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

module.exports = voxelPortal;
