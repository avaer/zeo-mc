var voxelAsync = require('../voxel-async/index');

function voxelModelRenderer(data, THREE) {
  const {entities, dims} = data;
  const models = voxelAsync.modelMesher(entities, dims);
  /* const mesh = makeMesh(models, THREE); // XXX hook in the below _makeObject
  return mesh; */
  return new THREE.Mesh();
}

function _makeObject(game, textures, meshes) {
  const root = new game.THREE.Object3D();

  const child = new game.THREE.Object3D();
  root.add(child);
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      let {position, dimensions, rotationPoint, uv, offset, textureIndex, children} = mesh;
      if (position && dimensions && rotationPoint && uv) {
        const {rotation = [0, 0, 0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];
        const texture = _resolveTexture(textures, textureIndex);

        const submesh = _makeCubeMesh(game, position, dimensions, texture, uv);

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
        const texture = _resolveTexture(textures, textureIndex);
        const submesh = _makeCubeMesh(game, position, dimensions, texture, uv);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        }
      } else if (position && dimensions && offset) {
        const {rotation = [0, 0, 0], oneSided = false} = mesh;
        const texture = _resolveTexture(textures, textureIndex);

        const submesh = _makePlaneMesh(game, position, dimensions, texture, offset, oneSided);
        submesh.rotation.set(-rotation[0] + Math.PI, -rotation[1], -rotation[2]);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        }
      } else if (rotationPoint && children) {
        const {rotation = [0,0,0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const subobject1 = new game.THREE.Object3D();
        subobject1.position.set(
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
  })(child, meshes);
  child.position.set(0.5, -1, -0.5);
  child.scale.set(0.1, 0.1, 0.1);

  return root;
}

let faceVertexUvs = null;
function _getFaceVertexUvs(game) {
  if (!faceVertexUvs) {
    const uv = [new game.THREE.Vector2(0, 0), new game.THREE.Vector2(0, 1), new game.THREE.Vector2(1, 1), new game.THREE.Vector2(1, 0)];
    faceVertexUvs = [[uv, uv, uv, uv, uv, uv]];
  }

  return faceVertexUvs;
}

function _resolveTexture(textures, textureIndex) {
  if (!Array.isArray(textures)) {
    textures = [textures];
  }
  if (typeof textureIndex !== 'number') {
    textureIndex = 0;
  }
  const texture = textures[textureIndex];
  return texture;
}

function _makeCubeMesh(game, position, dimensions, texture, uv) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], -dimensions[1], dimensions[2]];

  const geometry = _getCubeGeometry(dimensions[0], dimensions[1], dimensions[2]);
  geometry.faceVertexUvs = _getFaceVertexUvs(game);
  const material = _getCubeMaterial(game, texture, uv);
  const mesh = new game.THREE.Mesh(geometry, material);
  mesh.position.set(
    (position[0] + (dimensions[0] / 2)),
    (position[1] + (dimensions[1] / 2)),
    (position[2] + (dimensions[2] / 2)),
  );
  return mesh;
}

function _makePlaneMesh(game, position, dimensions, texture, offset, oneSided) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], -dimensions[1], dimensions[2]];

  const geometry = _getPlaneGeometry(dimensions[0], dimensions[1]);
  const material = _getPlaneMaterial(game, texture, offset, oneSided);
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

    const startX = uv[0];
    const startY = uv[1];
    const width = uv[2] - uv[0];
    const height = uv[3] - uv[1];

    function makeCoords(x, y) {
      return [
        startX + (x * width),
        startY + (y * height),
        startX + ((x + 1) * width),
        startY + ((y + 1) * height),
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

const cubeGeometryCache = new Map();
function _getCubeGeometry(x, y, z) {
  const geometryKey = x + '-' + y + '-' + z;

  const cachedGeometry = cubeGeometryCache.get(geometryKey);
  if (cachedGeometry) {
    return cachedGeometry;
  } else {
    const cubeGeometry = new game.THREE.CubeGeometry(x, y, z);
    const bufferGeometry = new game.THREE.BufferGeometry().fromGeometry(cubeGeometry);
    cubeGeometryCache.set(geometryKey, bufferGeometry);
    return bufferGeometry;
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

const planeGeometryCache = new Map();
function _getPlaneGeometry(x, y) {
  const geometryKey = x + '-' + y;

  const cachedGeometry = planeGeometryCache.get(geometryKey);
  if (cachedGeometry) {
    return cachedGeometry;
  } else {
    const geometry = new game.THREE.PlaneBufferGeometry(x, y);
    planeGeometryCache.set(geometryKey, geometry);
    return geometry;
  }
}

const planeMaterialCache = new Map();
function _getPlaneMaterial(game, textureName, offset, oneSided) {
  const materialKey = textureName + '-' + offset.join(',') + '-' + oneSided;

  const cachedMaterial = planeMaterialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const texture = _getTexture('/api/img/textures/' + textureName + '.png', offset);
    const material = new game.THREE.MeshBasicMaterial({
      map: texture,
      side: oneSided ? game.THREE.BackSide : game.THREE.DoubleSide,
      // transparent: true // XXX
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

module.exports = voxelModelRenderer;
