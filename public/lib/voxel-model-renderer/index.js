var voxelAsync = require('../voxel-async/index');

const MODEL_SCALE = 1 / 16;

function voxelModelRenderer(data, textureLoader, THREE) {
  const {entities, dims} = data;
  const models = voxelAsync.modelGenerator(entities, dims);
  const mesh = _makeObjects(models, textureLoader, THREE);
  return mesh;
}

function _makeObjects(models, textureLoader, THREE) {
  const object = new THREE.Object3D();
  for (let i = 0, l = models.length; i < l; i++) {
    const model = models[i];

    const {position, meshes, textures} = model;
    const subobject = _makeObject(meshes, textures, textureLoader, THREE);
    const boundingBox = new THREE.Box3().setFromObject(subobject);
    const minY = boundingBox.min.y;

    subobject.position.set(position[0], position[1] - minY, position[2]);

    object.add(subobject);
  }
  return object;
}

function _makeObject(meshes, textures, textureLoader, THREE) {
  const root = new THREE.Object3D();

  const child = new THREE.Object3D();
  root.add(child);
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      let {position, dimensions, rotationPoint, uv, offset, textureIndex, children} = mesh;
      if (position && dimensions && rotationPoint && uv) {
        const {rotation = [0, 0, 0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];
        const texture = _resolveTexture(textures, textureIndex);

        const submesh = _makeCubeMesh(position, dimensions, texture, uv, textureLoader, THREE);

        const subobject1 = new THREE.Object3D();
        subobject1.position.set(
          rotationPoint[0],
          rotationPoint[1],
          rotationPoint[2],
        );

        const subobject2 = new THREE.Object3D();
        subobject1.add(subobject2);
        subobject2.add(submesh);
        subobject2.rotation.set(-rotation[0], -rotation[1], -rotation[2]);

        object.add(subobject1);

        if (children) {
          recurse(object, children);
        }
      } else if (position && dimensions && uv) {
        const texture = _resolveTexture(textures, textureIndex);
        const submesh = _makeCubeMesh(position, dimensions, texture, uv, textureLoader, THREE);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        }
      } else if (rotationPoint && children) {
        const {rotation = [0,0,0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const subobject1 = new THREE.Object3D();
        subobject1.position.set(
          rotationPoint[0],
          rotationPoint[1],
          rotationPoint[2],
        );

        const subobject2 = new THREE.Object3D();
        subobject1.add(subobject2);
        subobject2.rotation.set(-rotation[0], -rotation[1], -rotation[2]);

        object.add(subobject1);

        recurse(subobject2, children);
      } else if (children) {
        const childrenobject = new THREE.Object3D();
        object.add(childrenobject);
        recurse(childrenobject, children);
      } else {
        throw new Error('unhandled case');
      }
    });
  })(child, meshes);
  child.position.set(0.5, -1, 0.5);
  child.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);

  return root;
}

let faceVertexUvs = null;
function _getFaceVertexUvs(THREE) {
  if (!faceVertexUvs) {
    const uv = [new THREE.Vector2(1, 1), new THREE.Vector2(1, 0), new THREE.Vector2(0, 0), new THREE.Vector2(0, 1)];
    const uv1 = [uv[0], uv[1], uv[3]];
    const uv2 = [uv[1], uv[2], uv[3]];
    faceVertexUvs = [
      [uv1, uv2, uv1, uv2, uv1, uv2, uv1, uv2, uv1, uv2, uv1, uv2]
    ];
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

function _makeCubeMesh(position, dimensions, texture, uv, textureLoader, THREE) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], dimensions[1], dimensions[2]];

  const geometry = _getCubeGeometry(dimensions[0], dimensions[1], dimensions[2], THREE);
  const material = _getCubeMaterial(texture, uv, textureLoader, THREE);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    (position[0] + (dimensions[0] / 2)),
    (position[1] + (-dimensions[1] / 2)),
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
function _getCubeGeometry(x, y, z, THREE) {
  const geometryKey = x + '-' + y + '-' + z;

  const cachedGeometry = cubeGeometryCache.get(geometryKey);
  if (cachedGeometry) {
    return cachedGeometry;
  } else {
    const cubeGeometry = new THREE.CubeGeometry(x, y, z);
    cubeGeometry.faceVertexUvs = _getFaceVertexUvs(THREE);
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry);
    cubeGeometryCache.set(geometryKey, bufferGeometry);
    return bufferGeometry;
  }
}

const cubeMaterialCache = new Map();
function _getCubeMaterial(textureName, uv, textureLoader, THREE) {
  uv = _normalizeUv(uv);
  const materialKey = textureName + '-' + uv.map(uv => uv.join(','));

  const cachedMaterial = cubeMaterialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const textureUrl = textureLoader.getTextureUrl(textureName);
      const texture = textureLoader.getTexture(textureUrl, uv[i], THREE);
      const submaterial = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.FrontSide,
        transparent: true,
        fog: true
      });
      materials.push(submaterial);
    }

    const material = new THREE.MultiMaterial(materials);
    cubeMaterialCache.set(materialKey, material);

    return material;
  }
}

const textureCache = new Map();
function _getTexture(url, offset, THREE) {
  const textureKey = url + '-' + offset.join(',');

  const cachedTexture = textureCache.get(textureKey);
  if (cachedTexture) {
    return cachedTexture;
  } else {
    const img = new Image();
    img.src = url;
    const texture = new THREE.Texture();
    img.onload = () => {
      const croppedImage = _cropImage(img, offset);
      croppedImage.onload = () => {
        texture.image = croppedImage;
        texture.needsUpdate = true;
      };
    };

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

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
