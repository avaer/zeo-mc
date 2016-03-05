import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTE_SIZE, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FACE, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

function voxelPlaneMesher(data, atlas, THREE) {
  const {faces} = data;
  const numFaces = faces.length;
  if (numFaces > 0) {
    const geometry = (() => {
      function getColorValue(i) {
        return faces[i];
      }

      function getFaceMaterial(colorValue) {
        return atlas.getFaceMaterial(colorValue);
      }

      function getPlaneMeshFrameUvs(faceMaterial, even) {
        return atlas.getPlaneMeshFrameUvs(faceMaterial, even);
      }

      const geometry = new THREE.BufferGeometry();

      const vertices = new Float32Array(numFaces * FACE_VERTICES * 3);
      for (let i = 0; i < numFaces; i++) {
        const faceVertices = [
          data.vertices[i * 4 + 0],
          data.vertices[i * 4 + 1],
          data.vertices[i * 4 + 2],
          data.vertices[i * 4 + 3]
        ];

        // abd
        vertices[i * 18 + 0] = faceVertices[0][0];
        vertices[i * 18 + 1] = faceVertices[0][1];
        vertices[i * 18 + 2] = faceVertices[0][2];

        vertices[i * 18 + 3] = faceVertices[1][0];
        vertices[i * 18 + 4] = faceVertices[1][1];
        vertices[i * 18 + 5] = faceVertices[1][2];

        vertices[i * 18 + 6] = faceVertices[3][0];
        vertices[i * 18 + 7] = faceVertices[3][1];
        vertices[i * 18 + 8] = faceVertices[3][2];

        // bcd
        vertices[i * 18 + 9] = faceVertices[1][0];
        vertices[i * 18 + 10] = faceVertices[1][1];
        vertices[i * 18 + 11] = faceVertices[1][2];

        vertices[i * 18 + 12] = faceVertices[2][0];
        vertices[i * 18 + 13] = faceVertices[2][1];
        vertices[i * 18 + 14] = faceVertices[2][2];

        vertices[i * 18 + 15] = faceVertices[3][0];
        vertices[i * 18 + 16] = faceVertices[3][1];
        vertices[i * 18 + 17] = faceVertices[3][2];
      }
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const frameUvs = (() => {
        const frameUvs = Array(FRAME_UV_ATTRIBUTES);
        for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
          frameUvs[i] = new Float32Array(numFaces * FACE_VERTICES * MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTES);
        }
        for (let i = 0; i < numFaces; i++) {
          const colorValue = getColorValue(i);
          const faceMaterial = getFaceMaterial(colorValue);

          const faceFrameUvs = getPlaneMeshFrameUvs(faceMaterial, i % 2 === 0);
          for (let j = 0; j < FRAME_UV_ATTRIBUTES; j++) {
            frameUvs[j].set(
              faceFrameUvs.slice(FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME * j, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME * (j + 1)),
              i * FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME
            );
          }
        }
        return frameUvs;
      })();
      for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
        geometry.addAttribute('frameUv' + i, new THREE.BufferAttribute(frameUvs[i], FRAME_UV_ATTRIBUTE_SIZE))
      }

      return geometry;
    })();

    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  } else {
    return null;
  }
}

module.exports = voxelPlaneMesher;
