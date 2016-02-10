export default class ModelBase {
  constructor() {
    this.textures = null;
    this.meshes = null;
  }

  getMesh(game) {
    return _makeObject(game, this.textures, this.meshes);
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
    const uv = [new game.THREE.Vector2(0, 0), new game.THREE.Vector2(0, 1), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(1, 0)];
    faceVertexUvs = [[uv, uv, uv, uv, uv, uv]];
  }

  return faceVertexUvs;
}

function _makeObject(game, textures, meshes) {
  const object = new game.THREE.Object3D();
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      let {position, dimensions, rotationPoint, uv, offset, children} = mesh;
      if (position && dimensions && rotationPoint && uv) {
        const {rotation = [0, 0, 0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const submesh = _makeCubeMesh(game, position, dimensions, textures, uv);

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

        if (children) {
          recurse(object, children);
        }
      } else if (position && dimensions && uv) {
        const submesh = _makeCubeMesh(game, position, dimensions, textures, uv);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        }
      } else if (position && dimensions && offset) {
        const {rotation = [0, 0, 0]} = mesh;

        const submesh = _makePlaneMesh(game, position, dimensions, textures, offset);
        submesh.rotation.set(-rotation[0] + Math.PI, -rotation[1], -rotation[2]);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        }
      } else if (rotationPoint && children) {
        const {rotation = [0,0,0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const subobject1 = new game.THREE.Object3D();
        subobject1.position.set( // XXX
          rotationPoint[0],
          rotationPoint[1],
          rotationPoint[2],
        );

        const subobject2 = new game.THREE.Object3D();
        subobject1.add(subobject2);
        subobject2.rotation.set(-rotation[0], -rotation[1], -rotation[2]);

        object.add(subobject1);

        recurse(subobject2, children);
      } else if (children) {
        const childrenobject = new game.THREE.Object3D();
        object.add(childrenobject);
        recurse(childrenobject, children);
      }
    });
  })(object, meshes);
  object.scale.set(0.1, 0.1, 0.1);
  return object;
}

function _makeCubeMesh(game, position, dimensions, textures, uv) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], -dimensions[1], dimensions[2]];

  const geometry = new game.THREE.CubeGeometry(dimensions[0], dimensions[1], dimensions[2]);
  geometry.faceVertexUvs = _getFaceVertexUvs(game);
  const material = _getCubeMaterial(game, textures, uv);
  const mesh = new game.THREE.Mesh(geometry, material);
  mesh.position.set(
    (position[0] + (dimensions[0] / 2)),
    (position[1] + (dimensions[1] / 2)),
    (position[2] + (dimensions[2] / 2)),
  );
  return mesh;
}

function _makePlaneMesh(game, position, dimensions, textures, offset) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], -dimensions[1], dimensions[2]];

  const geometry = new game.THREE.PlaneGeometry(dimensions[0], dimensions[1]);
  const material = _getPlaneMaterial(game, textures, offset);
  const mesh = new game.THREE.Mesh(geometry, material);
  mesh.position.set(
    (position[0] + (dimensions[0] / 2)),
    (position[1] + (dimensions[1] / 2)),
    (position[2] + (dimensions[2] / 2)),
  );
  return mesh;
}

function _normalizeUv(uv) {
  if (uv.length === 1) {
    uv = uv[0];

    const width = uv[2] - uv[0];
    const height = uv[3] - uv[1];

    function makeCoords(x, y) {
      return [
        uv[0] + (x * width),
        uv[1] + (y * height),
        uv[0] + ((x + 1) * width),
        uv[1] + ((y + 1) * height),
      ];
    }

    return [
      makeCoords(0, 1),
      makeCoords(2, 1),
      makeCoords(2, 0),
      makeCoords(1, 0),
      makeCoords(3, 1),
      makeCoords(1, 1),
    ];
  } else {
    return uv;
  }
}

const cubeMaterialCache = new Map();
function _getCubeMaterial(game, textureName, uv) {
  uv = _normalizeUv(uv);
  const materialKey = textureName + '-' + uv.map(uv => uv.join(','));

  const cachedMaterial = cubeMaterialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const texture = _getTexture('/api/img/textures/' + textureName + '.png', uv[i]);
      const submaterial = new game.THREE.MeshBasicMaterial({
        map: texture,
        side: game.THREE.BackSide,
        // side: game.THREE.DoubleSide,
        transparent: true
      });
      materials.push(submaterial);
    }

    const material = new game.THREE.MeshFaceMaterial(materials);
    cubeMaterialCache.set(materialKey, material);

    return material;
  }
}

const planeMaterialCache = new Map();
function _getPlaneMaterial(game, textureName, offset) {
  const materialKey = textureName + '-' + offset.join(',');

  const cachedMaterial = planeMaterialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const texture = _getTexture('/api/img/textures/' + textureName + '.png', offset);
    const material = new game.THREE.MeshBasicMaterial({
      map: texture,
      side: game.THREE.DoubleSide,
      transparent: true
    });

    planeMaterialCache.set(materialKey, material);

    return material;
  }
}

const textureCache = new Map();
function _getTexture(url, offset) {
  const textureKey = url + '-' + offset.join(',');

  const cachedTexture = textureCache.get(textureKey);
  if (cachedTexture) {
    return cachedTexture;
  } else {
    // const texture = game.THREE.ImageUtils.loadTexture(url);
    const img = new Image();
    img.src = url;
    const texture = new game.THREE.Texture();
    img.onload = () => {
      const croppedImage = _cropImage(img, offset);
      croppedImage.onload = () => {
        texture.image = croppedImage;
        texture.needsUpdate = true;
      };
    };

    texture.magFilter = game.THREE.NearestFilter;
    texture.minFilter = game.THREE.NearestFilter;

    textureCache.set(textureKey, texture);

    return texture;
  }
}

function _cropImage(img, offset) {
  const startX = offset[0];
  const startY = offset[1];
  const width = offset[2] - offset[0];
  const height = offset[3] - offset[1];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(img, startX, startY, width, height, 0, 0, width, height);
  const dataUrl = canvas.toDataURL();

  const newImg = new Image();
  newImg.src = dataUrl;
  return newImg;
}