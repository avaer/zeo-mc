const voxelAsync = require('../voxel-async/index');
const voxelBlockShader = require('../voxel-block-shader/index');
import {MATERIAL_FRAMES} from '../../constants/index';

function voxelRenderer(data, atlas, THREE) {
  const geometry = (() => {
    function getColorValue(faces, i) {
      return faces[i];
    }

    function getNormalDirection(normals, i) {
      const normalIndex = i * 6 * 3;
      if      (normals[normalIndex + 0] === 1)  return 1; // z === 1
      else if (normals[normalIndex + 1] === 1)  return 2; // y === 1
      else if (normals[normalIndex + 1] === -1) return 3; // y === -1
      else if (normals[normalIndex + 2] === -1) return 4; // x === -1
      else if (normals[normalIndex + 2] === 1)  return 5; // x === 0
      else                                           return 0;
    }

    function getFaceNormalMaterial(colorValue, normalDirection) {
      return atlas.getFaceNormalMaterial(colorValue, normalDirection);
    }

    function getFaceFrameUvs(faceMaterial) {
      return atlas.getBlockMeshFaceFrameUvs(faceMaterial);
    }

    const numFaces = data.faces.length;
    const vertices = new Float32Array(numFaces * 6 * 3);
    // const uvs = new Float32Array(numFaces * 6 * 2);
    // const colors = new Float32Array(numFaces * 6 * 3);

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

      /* const colorValue = data.faces[i];
      const colorArray = voxelBlockShader.colorValueToArray(colorValue);
      for (let j = 0; j < 6; j++) {
        colors[i * 18 + j * 3 + 0] = colorArray[0];
        colors[i * 18 + j * 3 + 1] = colorArray[1];
        colors[i * 18 + j * 3 + 2] = colorArray[2];
      } */
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    // geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.computeVertexNormals();

    const normals = geometry.getAttribute('normal').array;

    const frameUvs = new Float32Array(numFaces * 6 * MATERIAL_FRAMES * 2);
    for (let i = 0; i < numFaces; i++) {
      const colorValue = getColorValue(data.faces, i);
      const normalDirection = getNormalDirection(normals, i);
      const faceMaterial = getFaceNormalMaterial(colorValue, normalDirection);
      const faceFrameUvs = getFaceFrameUvs(faceMaterial);

      frameUvs.set(faceFrameUvs, i * MATERIAL_FRAMES * 2 * 6);
    }
    geometry.addAttribute('frameUv', new THREE.BufferAttribute(frameUvs, 2));

    return geometry;
  })();

  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

module.exports = voxelRenderer;
