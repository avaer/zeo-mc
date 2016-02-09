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

var woo = true;

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

var left = [new game.THREE.Vector2(0, .666), new game.THREE.Vector2(.5, .666), new game.THREE.Vector2(.5, 1), new game.THREE.Vector2(0, 1)];
var right = [new game.THREE.Vector2(.5, .666), new game.THREE.Vector2(1, .666), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(.5, 1)];
var bottom = [new game.THREE.Vector2(0, .333), new game.THREE.Vector2(.5, .333), new game.THREE.Vector2(.5, .666), new game.THREE.Vector2(0, .666)];
var back = [new game.THREE.Vector2(.5, .333), new game.THREE.Vector2(1, .333), new game.THREE.Vector2(1, .666), new game.THREE.Vector2(.5, .666)];
var top = [new game.THREE.Vector2(0, 0), new game.THREE.Vector2(.5, 0), new game.THREE.Vector2(.5, .333), new game.THREE.Vector2(0, .333)];
var front = [new game.THREE.Vector2(.5, 0), new game.THREE.Vector2(1, 0), new game.THREE.Vector2(1, .333), new game.THREE.Vector2(.5, .333)];
if (woo) {
woo = false;
console.log('got geo', geometry);
}

/* geometry.faceUvs[0] = new game.THREE.Vector2(0, 1);
geometry.faceUvs[1] = new game.THREE.Vector2(0, 1);
geometry.faceUvs[2] = new game.THREE.Vector2(0, 1);
geometry.faceUvs[3] = new game.THREE.Vector2(0, 1);
geometry.faceUvs[4] = new game.THREE.Vector2(0, 1);
geometry.faceUvs[5] = new game.THREE.Vector2(0, 1); */

geometry.faceVertexUvs[0][0] = left;
geometry.faceVertexUvs[0][1] = right;
geometry.faceVertexUvs[0][2] = bottom;
geometry.faceVertexUvs[0][3] = back;
geometry.faceVertexUvs[0][4] = top;
geometry.faceVertexUvs[0][5] = front;
/* geometry.faceVertexUvs[0] = [];
geometry.faceVertexUvs[0][0] = [ bricks[0], bricks[1], bricks[3] ];
geometry.faceVertexUvs[0][1] = [ bricks[1], bricks[2], bricks[3] ];
geometry.faceVertexUvs[0][2] = [ clouds[0], clouds[1], clouds[3] ];
geometry.faceVertexUvs[0][3] = [ clouds[1], clouds[2], clouds[3] ];
geometry.faceVertexUvs[0][4] = [ crate[0], crate[1], crate[3] ];
geometry.faceVertexUvs[0][5] = [ crate[1], crate[2], crate[3] ];
geometry.faceVertexUvs[0][6] = [ stone[0], stone[1], stone[3] ];
geometry.faceVertexUvs[0][7] = [ stone[1], stone[2], stone[3] ];
geometry.faceVertexUvs[0][8] = [ water[0], water[1], water[3] ];
geometry.faceVertexUvs[0][9] = [ water[1], water[2], water[3] ];
geometry.faceVertexUvs[0][10] = [ wood[0], wood[1], wood[3] ];
geometry.faceVertexUvs[0][11] = [ wood[1], wood[2], wood[3] ]; */

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
    if (i === 5) {
      texture.offset.x = -(0 / 32);
      texture.offset.y = 32 / 64;
      // console.log('texture scale', texture);
      texture.repeat.x = 1 / 4;
      texture.repeat.y = 3 / 4;
      /* texture.repeat.x = 0.1;
      texture.repeat.y = 0.1; */
      /* texture.repeat.x = 1;
      texture.repeat.y = 1; */
    }
    const submaterial = new game.THREE.MeshBasicMaterial({
      // color: 0xFF0000,
      map: texture,
      side: game.THREE.BackSide
    });
    materials.push(submaterial);
  }
  const material = new game.THREE.MeshFaceMaterial(materials);

  /* _loadTexture('/api/img/textures/' + textureName + '.png', img => {
    const texture = new game.THREE.Texture(img);
    const submaterial = new THREE.MeshLambertMaterial({
      map: texture
    });
    const materials = [];
    for (let i = 0; i < 6; i++) {
      materials.push(submaterial);
    }
    material.materials = materials;
    material.needsUpdate = true;
  }); */

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
