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


let faceVertexUvs = null;
function _getFaceVertexUvs(game) {
  if (!faceVertexUvs) {
    const left = [new game.THREE.Vector2(.5, .666), new game.THREE.Vector2(.5, 1), new game.THREE.Vector2(0, 1), new game.THREE.Vector2(0, .666)].reverse();
    const right = [new game.THREE.Vector2(1.5, .666), new game.THREE.Vector2(1.5, 1), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(1, .666)].reverse();
    const bottom = [new game.THREE.Vector2(1.5, 1.333), new game.THREE.Vector2(1, 1.333), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(1.5, 1)].reverse();
    const top = [new game.THREE.Vector2(.5, 1.333), new game.THREE.Vector2(.5, 1), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(1, 1.333)].reverse();
    const back = [new game.THREE.Vector2(2, .666), new game.THREE.Vector2(2, 1), new game.THREE.Vector2(1.5, 1), new game.THREE.Vector2(1.5, .666)].reverse();
    const front = [new game.THREE.Vector2(1, .666), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(.5, 1), new game.THREE.Vector2(.5, .666)].reverse();

    faceVertexUvs = [
      [left, right, bottom, top, back, front]
    ];
  }

  return faceVertexUvs;
}

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
        geometry.faceVertexUvs = _getFaceVertexUvs(game);

        const submesh = new game.THREE.Mesh(geometry, material);
        submesh.position.set(
          (position[0] + (dimensions[0] / 2)),
          (position[1] + (dimensions[1] / 2)),
          (position[2] + (dimensions[2] / 2)),
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

function _makeMaterial(game, textureName) {
  const materials = [];
  for (let i = 0; i < 6; i++) {
    const texture = _getTexture('/api/img/textures/' + textureName + '.png', i);

    const scaleY = 4;
    texture.repeat.x = 1 / scaleY;
    texture.repeat.y = 3 / scaleY;

    const submaterial = new game.THREE.MeshBasicMaterial({
      map: texture,
      side: game.THREE.BackSide
    });
    materials.push(submaterial);
  }

  const material = new game.THREE.MeshFaceMaterial(materials);
  return material;
}

const textureCache = new Map();
function _getTexture(url, i) {
  const textureKey = url + i;

  const cachedTexture = textureCache.get(textureKey);
  if (cachedTexture) {
    return cachedTexture;
  } else {
    const texture = game.THREE.ImageUtils.loadTexture(url);
    texture.magFilter = game.THREE.NearestFilter;
    texture.minFilter = game.THREE.NearestFilter;

    textureCache.set(textureKey, texture);

    return texture;
  }
}
