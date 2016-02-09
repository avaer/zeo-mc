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
  return (game, p = [], s = []) => {
    const model = new Model(p, s);
    return model.getMesh(game);
  };
};

function _makeObject(game, meshes, material) {
  const object = new game.THREE.Object3D();
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      let {position, dimensions, rotationPoint} = mesh;
      if (position && dimensions && rotationPoint) {
        const {uv = [0,0], scale = 1, rotation = [0,0,0]} = mesh;
        position = [position[0], -position[1], position[2]];
        dimensions = [dimensions[0], -dimensions[1], dimensions[2]];
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const geometry = new game.THREE.CubeGeometry(dimensions[0], dimensions[1], dimensions[2]);

        const submesh = new game.THREE.Mesh(geometry, material);
        submesh.position.set(
          (position[0] + (dimensions[0] / 2)) /* - (rotationPoint[0] / 2) */,
          (position[1] + (dimensions[1] / 2)) /* + (rotationPoint[1] / 2) */,
          (position[2] + (dimensions[2] / 2)) /* - (rotationPoint[2] / 2) */,
        );
        const subobject1 = new game.THREE.Object3D();
        subobject1.position.set(
          rotationPoint[0],
          rotationPoint[1],
          rotationPoint[2],
        );

        const subobject2 = new game.THREE.Object3D();
        subobject1.add(subobject2);
        subobject2.add(submesh);
        /* subobject2.position.set(
          rotationPoint[0] / 2,
          -rotationPoint[1] / 2,
          rotationPoint[2] / 2,
        ); */
        subobject2.rotation.set(-rotation[0], -rotation[1], -rotation[2]);

        object.add(subobject1);

        const {children} = mesh;
        if (children) {
          const childrenobject = new game.THREE.Object3D();
          object.add(childrenobject);
          recurse(childrenobject, children);
        }
      }
    });
  })(object, meshes);
  object.scale.set(0.1, 0.1, 0.1);
  return object;
}

function _makeMaterial(game, texture) {
  const material = new game.THREE.MeshLambertMaterial({ color: 0xFF0000, wireframe: true });

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
