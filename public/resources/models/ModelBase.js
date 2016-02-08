export default class ModelBase {
  constructor() {
    this.texture = null;
    this.meshes = null;

    this._material = null;
  }

  getMesh(game) {
    if (!this._material) {
      this._material = _makeMaterial(game, this.texture);
    }

    return _makeObject(game, this.meshes, this._material);
  }
}
ModelBase.make = Model => {
  const model = new Model();
  return game => model.getMesh(game);
};

function _makeObject(game, meshes, material) {
  const object = new game.THREE.Object3D();
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      const {children} = mesh;
      if (!children) {
        const {uv, position} = mesh;
        const [startPosition, dimensions] = position;

        const width = dimensions[0];
        const height = dimensions[1];
        const depth = dimensions[2];

        const geometry = new game.THREE.CubeGeometry(width, height, depth);

        const subobject = new game.THREE.Mesh(geometry, material);
        subobject.position.set(
          startPosition[0] + (width / 2),
          -startPosition[1] - (height / 2),
          startPosition[2] + (depth / 2)
        );
        object.add(subobject);
      } else {
        const subobject = new game.THREE.Object3D();
        object.add(subobject);
        recurse(subobject, children);
      }
    });
  })(object, meshes);
  object.scale.set(0.1, 0.1, 0.1);
  return object;
}

function _makeMaterial(game, texture) {
  const material = new game.THREE.MeshPhongMaterial({ color: 0x808080 });

  /* _loadTexture('/api/img/textures/' + texture + '.png', img => {
    material.map = new game.THREE.Texture(img);
    material.needsUpdate = true;
  }); */

  return material;
}

function _loadTexture(url, cb) {
  const img = new Image();
  img.onload = () => {
    done();
  };
  img.onerror = err => {
    console.warn(err);
    done();
  };
  img.src = url;

  function done() {
    cb(img);
  }
}
