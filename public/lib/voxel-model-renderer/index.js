var voxelAsync = require('../voxel-async/index');

function voxelModelRenderer(data, THREE) {
  const {entities, dims} = data;
  const models = voxelAsync.modelMesher(entities, dims);
  const mesh = _makeObjects(models, THREE);
  return mesh;
}

function _makeObjects(models, THREE) {
  const object = new THREE.Object3D();
  for (let i = 0, l = models.length; i < l; i++) {
    const model = models[i];

    const {position, meshes, textures} = model;
    const subobject = _makeObject(meshes, textures, THREE);
    subobject.position.set(position[0], position[1] + 3, position[2]);

    object.add(subobject);
  }
  return object;
}

function _makeObject(meshes, textures, THREE) {
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

        const submesh = _makeCubeMesh(position, dimensions, texture, uv, THREE);

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
        const submesh = _makeCubeMesh(position, dimensions, texture, uv, THREE);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        }
      } else if (position && dimensions && offset) {
        throw new Error('unhandled case');

        /* const {rotation = [0, 0, 0], oneSided = false} = mesh;
        const texture = _resolveTexture(textures, textureIndex);

        const submesh = _makePlaneMesh(position, dimensions, texture, offset, oneSided, THREE);
        submesh.rotation.set(-rotation[0] + Math.PI, -rotation[1], -rotation[2]);

        object.add(submesh);

        if (children) {
          recurse(object, children);
        } */
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
        throw new Error('unhandled case');

        /* const childrenobject = new THREE.Object3D();
        object.add(childrenobject);
        recurse(childrenobject, children); */
      }
    });
  })(child, meshes);
  child.position.set(0.5, -1, -0.5);
  child.scale.set(0.1, 0.1, 0.1);

  return root;
}

let faceVertexUvs = null;
function _getFaceVertexUvs(THREE) {
  if (!faceVertexUvs) {
    const uv = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0)];
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

function _makeCubeMesh(position, dimensions, texture, uv, THREE) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], -dimensions[1], dimensions[2]];

  const geometry = _getCubeGeometry(dimensions[0], dimensions[1], dimensions[2], THREE);
  const material = _getCubeMaterial(texture, uv, THREE);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    (position[0] + (dimensions[0] / 2)),
    (position[1] + (dimensions[1] / 2)),
    (position[2] + (dimensions[2] / 2)),
  );
  return mesh;
}

function _makePlaneMesh(position, dimensions, texture, offset, oneSided, THREE) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], -dimensions[1], dimensions[2]];

  const geometry = _getPlaneGeometry(dimensions[0], dimensions[1], THREE);
  const material = _getPlaneMaterial(texture, offset, oneSided, THREE);
  const mesh = new THREE.Mesh(geometry, material);
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
function _getCubeMaterial(textureName, uv, THREE) {
  uv = _normalizeUv(uv);
  const materialKey = textureName + '-' + uv.map(uv => uv.join(','));

  const cachedMaterial = cubeMaterialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const texture = _getTexture('/api/img/textures/' + textureName + '.png', uv[i], THREE);
      const submaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        // side: THREE.DoubleSide,
        transparent: true
      });
      materials.push(submaterial);
    }

    const material = new THREE.MultiMaterial(materials);
    cubeMaterialCache.set(materialKey, material);

    return material;
  }
}

const planeGeometryCache = new Map();
function _getPlaneGeometry(x, y, THREE) {
  const geometryKey = x + '-' + y;

  const cachedGeometry = planeGeometryCache.get(geometryKey);
  if (cachedGeometry) {
    return cachedGeometry;
  } else {
    const geometry = new THREE.PlaneBufferGeometry(x, y);
    planeGeometryCache.set(geometryKey, geometry);
    return geometry;
  }
}

const planeMaterialCache = new Map();
function _getPlaneMaterial(textureName, offset, oneSided, THREE) {
  const materialKey = textureName + '-' + offset.join(',') + '-' + oneSided;

  const cachedMaterial = planeMaterialCache.get(materialKey);
  if (cachedMaterial) {
    return cachedMaterial;
  } else {
    const texture = _getTexture('/api/img/textures/' + textureName + '.png', offset, THREE);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: oneSided ? THREE.BackSide : THREE.DoubleSide,
      // transparent: true // XXX
    });

    planeMaterialCache.set(materialKey, material);

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
