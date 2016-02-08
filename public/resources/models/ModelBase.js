export default class ModelBase {
  constructor() {
    this.texture = null;
    this.meshes = null;

    this._geometry = null;
    this._material = null;
  }

  getMesh(game) {
    if (!this._geometry) {
      this._geometry = _makeGeometry(game, this.meshes);
    }
    if (!this._material) {
      this._material = _makeMaterial(game, this.texture);
    }

    return new game.THREE.Mesh(this._geometry, this._material);
  }
}

function _makeGeometry(game, meshes) {
  const geometry = new game.THREE.Geometry();
  // XXX
  return geometry;
}

function _makeMaterial(game, texture) {
  const material = new game.THREE.Material();
  // XXX
  return material;
}
