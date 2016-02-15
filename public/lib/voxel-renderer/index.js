const voxelTextureShader = require('../voxel-texture-shader/index');

function voxelRenderer(data, THREE) {
  const geometry = (() => {
    function getFaceVertexUvs(i) {
      const vs = [
        data.vertices[i*4+0],
        data.vertices[i*4+1],
        data.vertices[i*4+2],
        data.vertices[i*4+3]
      ]
      const spans = {
        x0: vs[0][0] - vs[1][0],
        x1: vs[1][0] - vs[2][0],
        y0: vs[0][1] - vs[1][1],
        y1: vs[1][1] - vs[2][1],
        z0: vs[0][2] - vs[1][2],
        z1: vs[1][2] - vs[2][2]
      }
      const size = {
        x: Math.max(Math.abs(spans.x0), Math.abs(spans.x1)),
        y: Math.max(Math.abs(spans.y0), Math.abs(spans.y1)),
        z: Math.max(Math.abs(spans.z0), Math.abs(spans.z1))
      }
      let width, height;
      if (size.x === 0) {
        if (spans.y0 > spans.y1) {
          width = size.y;
          height = size.z;
        } else {
          width = size.z;
          height = size.y;
        }
      }
      if (size.y === 0) {
        if (spans.x0 > spans.x1) {
          width = size.x;
          height = size.z;
        } else {
          width = size.z;
          height = size.x;
        }
      }
      if (size.z === 0) {
        if (spans.x0 > spans.x1) {
          width = size.x;
          height = size.y;
        } else {
          width = size.y;
          height = size.x;
        }
      }
      if ((size.z === 0 && spans.x0 < spans.x1) || (size.x === 0 && spans.y0 > spans.y1)) {
        return [
          [height, 0],
          [0, 0],
          [0, width],
          [height, width]
        ]
      } else {
        return [
          [0, 0],
          [0, height],
          [width, height],
          [width, 0]
        ]
      }
    }

    const vertices = new Float32Array(data.faces.length * 6 * 3);
    const uvs = new Float32Array(data.faces.length * 6 * 2);
    const colors = new Float32Array(data.faces.length * 6 * 3);

    for (let i = 0, l = data.faces.length; i < l; i++) {
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

    for (let i = 0, l = data.faces.length; i < l; i++) {
      const faceVertexUvs = getFaceVertexUvs(i);

      uvs[i * 12 + 0] = faceVertexUvs[0][0];
      uvs[i * 12 + 1] = faceVertexUvs[0][1];
      uvs[i * 12 + 2] = faceVertexUvs[1][0];
      uvs[i * 12 + 3] = faceVertexUvs[1][1];
      uvs[i * 12 + 4] = faceVertexUvs[3][0];
      uvs[i * 12 + 5] = faceVertexUvs[3][1];

      uvs[i * 12 + 6] = faceVertexUvs[1][0];
      uvs[i * 12 + 7] = faceVertexUvs[1][1];
      uvs[i * 12 + 8] = faceVertexUvs[2][0];
      uvs[i * 12 + 9] = faceVertexUvs[2][1];
      uvs[i * 12 + 10] = faceVertexUvs[3][0];
      uvs[i * 12 + 11] = faceVertexUvs[3][1];
    }

    for (let i = 0, l = data.faces.length; i < l; i++) {
      const colorValue = data.faces[i];
      const colorArray = voxelTextureShader.colorValueToArray(colorValue);

      for (let j = 0; j < 6; j++) {
        colors[i * 18 + j * 3 + 0] = colorArray[0];
        colors[i * 18 + j * 3 + 1] = colorArray[1];
        colors[i * 18 + j * 3 + 2] = colorArray[2];
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.computeVertexNormals();

    return geometry;
  })();

  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

module.exports = voxelRenderer;
