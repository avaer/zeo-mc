export default class ModelBase {
  constructor() {
    this.texture = null;
    this.meshes = null;
  }

  getMesh(game) {
    return _makeObject(game, this.texture, this.meshes);
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

function _makeObject(game, texture, meshes) {
  const object = new game.THREE.Object3D();
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      let {position, dimensions, rotationPoint, uv} = mesh;
      if (position && dimensions && rotationPoint && uv) {
        const {scale = 1, rotation = [0,0,0]} = mesh;
        position = [position[0], -position[1], position[2]];
        dimensions = [dimensions[0], -dimensions[1], dimensions[2]];
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const geometry = new game.THREE.CubeGeometry(dimensions[0], dimensions[1], dimensions[2]);
        geometry.faceVertexUvs = _getFaceVertexUvs(game);

        const submesh = new game.THREE.Mesh(geometry, _getMaterial(game, texture, uv));
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

const materialCache = new Map();
function _getMaterial(game, textureName, uv) {
  uv = _normalizeUv(uv);
  const materialKey = textureName + '-' + uv.map(uv => uv.join(','));

  const cachedMaterial = materialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const texture = _getTexture('/api/img/textures/' + textureName + '.png', uv[i]);
      const submaterial = new game.THREE.MeshBasicMaterial({
        map: texture,
        side: game.THREE.BackSide,
        // transparent: true
      });
      materials.push(submaterial);
    }

    const material = new game.THREE.MeshFaceMaterial(materials);
    materialCache.set(materialKey, material);

    return material;
  }
}

const textureCache = new Map();
function _getTexture(url, uv) {
  const textureKey = url + '-' + uv.join(',');

  const cachedTexture = textureCache.get(textureKey);
  if (cachedTexture) {
    return cachedTexture;
  } else {
    // const texture = game.THREE.ImageUtils.loadTexture(url);
    const img = new Image();
    img.src = url;
    const texture = new game.THREE.Texture();
    img.onload = () => {
      const croppedImage = _cropImage(img, uv);
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

function _cropImage(img, uv) {
  const width = uv[2] - uv[0];
  const height = uv[3] - uv[1];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(img, uv[0], uv[1], width, height, 0, 0, width, height);
  const dataUrl = canvas.toDataURL();

  const newImg = new Image();
  newImg.src = dataUrl;
  return newImg;
}
