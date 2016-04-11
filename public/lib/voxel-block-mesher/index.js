import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTE_SIZE, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FACE, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

function voxelBlockMesher(data, textureAtlas, THREE) {
  const {vertices: verticesData, faces: facesData} = data;

  const numFaces = facesData.length;
  if (numFaces > 0) {
    const geometry = (() => {
      const geometry = new THREE.BufferGeometry();

      const vertices = voxelBlockMesher.getVertices(verticesData);
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const normals = geometry.getAttribute('normal').array;
      const frameUvs = voxelBlockMesher.getFrameUvs(facesData, normals, textureAtlas);
      voxelBlockMesher.applyFrameUvs(geometry, frameUvs, THREE);

      return geometry;
    })();

    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  } else {
    return null;
  }
}

voxelBlockMesher.getVertices = function(verticesData) {
  const numFaces = verticesData.length / 4;
  const result = new Float32Array(numFaces * FACE_VERTICES * 3);

  for (let i = 0; i < numFaces; i++) {
    const faceVertices = [
      verticesData[i * 4 + 0],
      verticesData[i * 4 + 1],
      verticesData[i * 4 + 2],
      verticesData[i * 4 + 3]
    ];

    // abd
    result[i * 18 + 0] = faceVertices[0][0];
    result[i * 18 + 1] = faceVertices[0][1];
    result[i * 18 + 2] = faceVertices[0][2];

    result[i * 18 + 3] = faceVertices[1][0];
    result[i * 18 + 4] = faceVertices[1][1];
    result[i * 18 + 5] = faceVertices[1][2];

    result[i * 18 + 6] = faceVertices[3][0];
    result[i * 18 + 7] = faceVertices[3][1];
    result[i * 18 + 8] = faceVertices[3][2];

    // bcd
    result[i * 18 + 9] = faceVertices[1][0];
    result[i * 18 + 10] = faceVertices[1][1];
    result[i * 18 + 11] = faceVertices[1][2];

    result[i * 18 + 12] = faceVertices[2][0];
    result[i * 18 + 13] = faceVertices[2][1];
    result[i * 18 + 14] = faceVertices[2][2];

    result[i * 18 + 15] = faceVertices[3][0];
    result[i * 18 + 16] = faceVertices[3][1];
    result[i * 18 + 17] = faceVertices[3][2];
  }

  return result;
};

voxelBlockMesher.getFrameUvs = function(facesData, normals, textureAtlas) {
  const numFaces = facesData.length;
  const sizePerAttribute = numFaces * FACE_VERTICES * MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTES;
  const result = new Float32Array(FRAME_UV_ATTRIBUTES * sizePerAttribute);

  for (let i = 0; i < numFaces; i++) {
    const colorValue = getColorValue(i);
    const normalDirection = getNormalDirection(i);
    const faceMaterial = getFaceNormalMaterial(colorValue, normalDirection);

    // frame uvs for one face frame (6 copies of each 4 attribute floats in sequence)
    const faceFrameUvs = getFaceFrameUvs(faceMaterial);

    for (let j = 0; j < FRAME_UV_ATTRIBUTES; j++) {
      result.set(
        faceFrameUvs.slice(j * FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME, (j + 1) * FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME),
        (j * sizePerAttribute) + (i * FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME)
      );
    }
  }

  return result;

  function getColorValue(i) {
    return facesData[i];
  }

  function getNormalDirection(i) {
    const normalIndex = i * FACE_VERTICES * 3;
    if      (normals[normalIndex + 0] === 1)  return 1; // z === 1
    else if (normals[normalIndex + 1] === 1)  return 2; // y === 1
    else if (normals[normalIndex + 1] === -1) return 3; // y === -1
    else if (normals[normalIndex + 2] === -1) return 4; // x === -1
    else if (normals[normalIndex + 2] === 1)  return 5; // x === 0
    else                                      return 0;
  }

  function getFaceNormalMaterial(colorValue, normalDirection) {
    return textureAtlas.getFaceNormalMaterial(colorValue, normalDirection);
  }

  function getFaceFrameUvs(faceMaterial) {
    return textureAtlas.getBlockMeshFaceFrameUvs(faceMaterial);
  }
};

voxelBlockMesher.applyFrameUvs = function(geometry, frameUvs, THREE) {
  const sizePerAttribute = frameUvs.length / FRAME_UV_ATTRIBUTES;
  for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
    geometry.addAttribute(
      'frameUv' + i,
      new THREE.BufferAttribute(frameUvs.slice(i * sizePerAttribute, (i + 1) * sizePerAttribute), FRAME_UV_ATTRIBUTE_SIZE)
    );
  }
};

module.exports = voxelBlockMesher;
