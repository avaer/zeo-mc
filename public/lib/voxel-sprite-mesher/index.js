// import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTE_SIZE, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FACE, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

const SIZE = 0.25;
const BYTES_PER_PIXEL = 4;

function voxelSpriteMesher(data, textureLoader, THREE) {
  const {vertices: verticesData, faces: facesData} = data;
  const numFaces = facesData.length;
  if (numFaces > 0) {
    const object = new THREE.Object3D();

    const pixelGeometry = getPixelGeometry(THREE);
    const pixelMaterial = getPixelMaterial(THREE);
    for (let i = 0; i < numFaces; i++) {
      const mesh = (() => {
        const geometry = (() => {
          const item = facesData[i];
          const textureUrl = textureLoader.getTextureUrl('items/' + item);
          const texture = textureLoader.getCachedTexture(textureUrl);
          if (!texture) {
            throw new Error('failed to load cached texture: ' + JSON.stringify(item));
          }

          const imageData = textureLoader.getImageData(texture);
          const {data: pixelData, width, height} = imageData;
          console.log('got image data', {pixelData, width, height}); // XXX

          function getPixel(x, y) {
            const index = (x + y * width) * BYTES_PER_PIXEL;
            return [
              pixelData[index + 0],
              pixelData[index + 1],
              pixelData[index + 2],
              pixelData[index + 3],
            ];
          }

          const bufferGeometry = (() => {
            const bufferGeometry = new THREE.BufferGeometry();

            const vertices = new Float32Array(0);
            bufferGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

            const colors = new Float32Array(0);
            bufferGeometry.addAttribute('color', new THREE.BufferAttribute(vertices, 3));

            return bufferGeometry;
          })();
          return bufferGeometry;
        })();
        const material = pixelMaterial;
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
      })();
      object.add(mesh);
    }

    return object;

    /* const geometry = (() => {
      const geometry = new THREE.BufferGeometry();

      const vertices = voxelPlaneMesher.getVertices(verticesData);
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      const frameUvs = voxelPlaneMesher.getFrameUvs(facesData, atlas);
      voxelPlaneMesher.applyFrameUvs(geometry, frameUvs, THREE);

      return geometry;
    })();

    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    return mesh; */
  } else {
    return null;
  }
}

/* voxelSpriteMesher.getVertices = function(verticesData) {
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

voxelSpriteMesher.getFrameUvs = function(facesData, atlas) {
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
    return atlas.getFaceMaterial(colorValue);
  }

  function getPlaneMeshFrameUvs(faceMaterial, even) {
    return atlas.getPlaneMeshFrameUvs(faceMaterial, even);
  }
};

voxelSpriteMesher.applyFrameUvs = function(geometry, frameUvs, THREE) {
  for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
    geometry.addAttribute('frameUv' + i, new THREE.BufferAttribute(frameUvs[i], FRAME_UV_ATTRIBUTE_SIZE))
  }
}; */

let cachedPixelGeometry = null;
function getPixelGeometry(THREE) {
  if (cachedPixelGeometry === null) {
    const pixelGeometry = new THREE.CubeGeometry(SIZE, SIZE, SIZE);
    for (let i = 0; i < pixelGeometry.vertices.length; i++) {
      pixelGeometry.vertices[i].x -= SIZE/2;
      pixelGeometry.vertices[i].y -= SIZE/2;
      pixelGeometry.vertices[i].z -= SIZE/2;
    }
    cachedPixelGeometry = pixelGeometry;
  }
  return cachedPixelGeometry;
}

let cachedPixelMaterial = null;
function getPixelMaterial(THREE) {
  if (cachedPixelMaterial === null) {
    const pixelMaterial = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors
    });
    cachedPixelMaterial = pixelMaterial;
  }
  return cachedPixelMaterial;
}

module.exports = voxelSpriteMesher;
