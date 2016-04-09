import {SPRITES} from '../../../metadata/index';

const SIZE = 1;

const ITEM_OFFSET = [0, 1.35, 1.1];
const WEAPON_OFFSET = [-1.5, 1.225, 0.5];

const ITEM_ROTATION = [0, Math.PI/2, 0];
const WEAPON_ROTATION = [0, 0, 0];

const SCALE = 0.075;
const BYTES_PER_PIXEL = 4;
const CUBE_VERTICES = 108;

function voxelSpriteMesher(data, textureLoader, THREE) {
  const {vertices: verticesData, faces: facesData} = data;
  const numFaces = facesData.length;
  if (numFaces > 0) {
    const object = new THREE.Object3D();

    for (let i = 0; i < numFaces; i++) {
      const item = facesData[i];

      const mesh = (() => {
        const geometry = (() => {
          const textureUrl = textureLoader.getTextureUrl('items/' + item);
          const texture = textureLoader.getCachedTexture(textureUrl);
          if (!texture) {
            throw new Error('failed to load cached texture: ' + JSON.stringify(item));
          }

          const imageData = textureLoader.getImageData(texture);
          const {data: pixelData, width, height} = imageData;

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

        const isWeapon = Boolean(SPRITES.WEAPONS[item]);
        if (!isWeapon) {
          mesh.position.set(ITEM_OFFSET[0], ITEM_OFFSET[1], ITEM_OFFSET[2]);
        } else {
          mesh.position.set(WEAPON_OFFSET[0], WEAPON_OFFSET[1], WEAPON_OFFSET[2]);
        }

        if (!isWeapon) {
          mesh.rotation.set(ITEM_ROTATION[0], ITEM_ROTATION[1], ITEM_ROTATION[2]);
        } else {
          mesh.rotation.set(WEAPON_ROTATION[0], WEAPON_ROTATION[1], WEAPON_ROTATION[2]);
        }

        mesh.scale.set(SCALE, SCALE, SCALE);
        return mesh;
      })();
      object.add(mesh);
    }

    return object;
  } else {
    return null;
  }
}

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
