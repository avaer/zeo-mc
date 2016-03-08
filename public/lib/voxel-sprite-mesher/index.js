// import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTE_SIZE, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FACE, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

const SIZE = 1;
// const OFFSET = [-1.5, 1.5, 0];
// const OFFSET = [0, 1.5, 1];
const OFFSET = [0, 1.35, 1.1];
const ROTATION = [0, Math.PI/2, 0];
const SCALE = 0.075;
const BYTES_PER_PIXEL = 4;
const CUBE_VERTICES = 108;

function voxelSpriteMesher(data, textureLoader, THREE) {
  const {vertices: verticesData, faces: facesData} = data;
  const numFaces = facesData.length;
  if (numFaces > 0) {
    const object = new THREE.Object3D();

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

          // generate vertices / colors
          const vertices = [];
          const colors = [];
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const pixel = getPixel(x, y);
              const [r, g, b, a] = pixel;
              const aFactor = a / 255;
              if (aFactor > 0.5) {
                const rFactor = r / 255;
                const gFactor = g / 255;
                const bFactor = b / 255;

                const pixelVertices = getPixelVertices(x, y, THREE);
                for (let i = 0; i < CUBE_VERTICES / 3; i++) {
                  vertices.push(pixelVertices[i * 3 + 0], pixelVertices[i * 3 + 1], pixelVertices[i * 3 + 2]);
                  colors.push(rFactor, gFactor, bFactor);
                }
              }
            }
          }

          /* // cull adjacent faces
          const culledVertices = [];
          const culledColors = [];
          const seenFacesIndex = {};
          function getFaceKey(vs) {
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < 12; i += 3) x += vs[i];
            for (let i = 1; i < 12; i += 3) y += vs[i];
            for (let i = 2; i < 12; i += 3) z += vs[i];
            return x + y * 256 + z * 256 * 256;
          }
          for (let i = 0; i < vertices.length / 12; i++) {
            const faceVertices = vertices.slice(i * 12, (i + 1) * 12);
            const faceKey = getFaceKey(faceVertices);
            if (!(faceKey in seenFacesIndex)) {
              for (let j = 0; j < 12; j++) {
                culledVertices.push(vertices[i * 12 + j]);
                culledColors.push(colors[i * 12 + j]);
              }

              seenFacesIndex[faceKey] = true;
            }
          } */

          // construct geometry
          const geometry = new THREE.BufferGeometry();
          geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
          geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
          /* geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(culledVertices), 3));
          geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(culledColors), 3)); */
          return geometry;
        })();
        const material = getPixelMaterial(THREE);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(OFFSET[0], OFFSET[1], OFFSET[2]);
        mesh.rotation.set(ROTATION[0], ROTATION[1], ROTATION[2]);
        mesh.scale.set(SCALE, SCALE, SCALE);
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

let cachedPixelGeometryVertices = null;
function getPixelGeometryVertices(THREE) {
  if (cachedPixelGeometryVertices === null) {
    const cubeGeometry = new THREE.CubeGeometry(SIZE, SIZE, SIZE);
    for (let i = 0; i < cubeGeometry.vertices.length; i++) {
      cubeGeometry.vertices[i].x -= SIZE/2;
      cubeGeometry.vertices[i].y -= SIZE/2;
      cubeGeometry.vertices[i].z -= SIZE/2;
    }
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry);
    const pixelGeometryVertices = bufferGeometry.getAttribute('position').array;
    cachedPixelGeometryVertices = pixelGeometryVertices;
  }
  return cachedPixelGeometryVertices;
}

function getPixelVertices(x, y, THREE) {
  const pixelGeometryVertices = getPixelGeometryVertices(THREE);
  const pixelVertices = pixelGeometryVertices.slice();
  for (let i = 0; i < CUBE_VERTICES; i += 3) {
    pixelVertices[i] += x;
  }
  for (let i = 1; i < CUBE_VERTICES; i += 3) {
    pixelVertices[i] -= y;
  }
  return pixelVertices;
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
