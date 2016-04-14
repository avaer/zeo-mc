var voxelAsync = require('../voxel-async/index');

const MODEL_SCALE = 1 / 16;

function voxelModelRenderer(data, textureAtlas, THREE) {
  const {entities, dims} = data;
  const models = voxelAsync.modelGenerator(entities, dims);
  const mesh = _makeObjects(models, textureAtlas, THREE);
  return mesh;
}

function _makeObjects(models, textureAtlas, THREE) {
  const object = new THREE.Object3D();
  for (let i = 0, l = models.length; i < l; i++) {
    const model = models[i];

    const {position, meshes, texture} = model;
    const subobject = _makeObject(meshes, texture, textureAtlas, THREE);
    const boundingBox = new THREE.Box3().setFromObject(subobject);
    const minY = boundingBox.min.y;

    subobject.position.set(position[0], position[1] - minY, position[2]);

    object.add(subobject);
  }
  return object;
}

function _makeObject(meshes, texture, textureAtlas, THREE) {
  const root = new THREE.Object3D();

  const child = new THREE.Object3D();
  root.add(child);
  (function recurse(object, meshes) {
    meshes.forEach(mesh => {
      let {position, dimensions, rotationPoint, uv, offset, children} = mesh;
      if (position && dimensions && rotationPoint && uv) {
        const {rotation = [0, 0, 0]} = mesh;
        rotationPoint = [rotationPoint[0], -rotationPoint[1], rotationPoint[2]];

        const submesh = _makeCubeMesh(position, dimensions, texture, uv, textureAtlas, THREE);

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
        const submesh = _makeCubeMesh(position, dimensions, texture, uv, textureAtlas, THREE);

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

function _makeCubeMesh(position, dimensions, texture, uv, textureAtlas, THREE) {
  position = [position[0], -position[1], position[2]];
  dimensions = [dimensions[0], dimensions[1], dimensions[2]];

  const geometry = (() => {
    const geometry = _getCubeGeometry(dimensions[0], dimensions[1], dimensions[2], THREE);
    const uvs = _getFaceUvs(texture, uv, textureAtlas);
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    return geometry;
  })();
  const material = _getCubeMaterial(textureAtlas, THREE);
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

let cubeMaterial = null;
function _getCubeMaterial(textureAtlas, THREE) {
  if (cubeMaterial === null) {
    cubeMaterial = new THREE.MeshLambertMaterial({
      map: textureAtlas.getTexture(),
      transparent: true,
      fog: true
    });
  }
  return cubeMaterial;
}

function _getFaceUvs(texture, uv, textureAtlas) {
  uv = _normalizeUv(uv);

  console.log('get face uvs', uv, textureAtlas); // XXX

  const result = new Float32Array(6 * 2 * 3 * 2);
  return result;
}

module.exports = voxelModelRenderer;
