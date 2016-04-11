import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTE_SIZE, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FACE, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

function voxelPlaneMesher(data, textureAtlas, THREE) {
  const {vertices: verticesData, faces: facesData} = data;
  const numFaces = facesData.length;
  if (numFaces > 0) {
    const geometry = (() => {
      const geometry = new THREE.BufferGeometry();

      const vertices = voxelPlaneMesher.getVertices(verticesData);
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const frameUvs = voxelPlaneMesher.getFrameUvs(facesData, textureAtlas);
      voxelPlaneMesher.applyFrameUvs(geometry, frameUvs, THREE);

      return geometry;
    })();

    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  } else {
    return null;
  }
}

voxelPlaneMesher.getVertices = function(verticesData) {
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

voxelPlaneMesher.getFrameUvs = function(facesData, textureAtlas) {
  const numFaces = facesData.length;
  const result = Array(FRAME_UV_ATTRIBUTES);

  for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
    result[i] = new Float32Array(numFaces * FACE_VERTICES * MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTES);
  }
  for (let i = 0; i < numFaces; i++) {
    const colorValue = getColorValue(i);
    const faceMaterial = getFaceMaterial(colorValue);

    // frame uvs for one face frame (indexed by attribute, vertex, frame, uv)
    const faceFrameUvs = getPlaneMeshFrameUvs(faceMaterial, i % 2 === 0);

    for (let j = 0; j < FRAME_UV_ATTRIBUTES; j++) {
      result[j].set(
        faceFrameUvs.slice(FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME * j, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME * (j + 1)),
        i * FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME
      );
    }
  }

  return result;

  function getColorValue(i) {
    return facesData[i];
  }

  function getFaceMaterial(colorValue) {
    return textureAtlas.getFaceMaterial(colorValue);
  }

  function getPlaneMeshFrameUvs(faceMaterial, even) {
    return textureAtlas.getPlaneMeshFrameUvs(faceMaterial, even);
  }
};

voxelPlaneMesher.applyFrameUvs = function(geometry, frameUvs, THREE) {
  for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
    geometry.addAttribute('frameUv' + i, new THREE.BufferAttribute(frameUvs[i], FRAME_UV_ATTRIBUTE_SIZE))
  }
};

module.exports = voxelPlaneMesher;
