import THREE from 'three';
import voxelUtils from '../../../lib/voxel-utils/index';
import voxelTextureAtlas from '../voxel-texture-atlas/index';
import {BLOCK_MODELS as BlockModels} from '../../../metadata/index';
import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

const {BLOCK_MODELS, BLOCK_MODEL_INDEX} = BlockModels;

const VERTICES_SIZE_PER_FACE = 2 * 3 * 3;
const NORMALS_SIZE_PER_FACE = VERTICES_SIZE_PER_FACE;
const FACE_UVS_SIZE_PER_FACE = 2 * 3 * 2;

function voxelBlockModelGenerator(voxelAsync) {
  const vu = voxelUtils({chunkSize: voxelAsync.initData.chunkSize});

  return function({voxels, metadata}, dims) {
    const mesh = voxelBlockModelGenerator.getMesh({voxels, metadata}, dims, voxelAsync, vu);
    // const {vertices: verticesData, faces: facesData} = mesh;

    const geometry = voxelBlockModelGenerator.getGeometry(mesh, voxelAsync);
    const {vertices, normals, faceUvs} = geometry;
    // const normals = voxelBlockModelGenerator.getNormals(vertices);
    // const frameUvs = voxelBlockModelGenerator.getFrameUvs(facesData, voxelAsync);
    return {vertices, normals, faceUvs/*, frameUvs*/};
  };
}

voxelBlockModelGenerator.getMesh = function({voxels, metadata}, dims, voxelAsync, vu) {
  const {chunkSize} = voxelAsync.initData;

  const positions = [];
  const dimensions = [];
  const faces = [];

  for (let z = 0; z < chunkSize; z++) {
    for (let y = 0; y < chunkSize; y++) {
      for (let x = 0; x < chunkSize; x++) {
        const idx = vu.getIndex(x, y, z);
        const block = voxels[idx];
        if (block) {
          const blockModel = vu.getBlockMetadataModel(metadata.buffer, idx);
          if (blockModel) {
            const blockModelName = BLOCK_MODEL_INDEX[blockModel - 1];
            const blockModelSpec = BLOCK_MODELS[blockModelName];
            const {geometry: geometrySpecs} = blockModelSpec;
            for (let i = 0; i < geometrySpecs.length; i++) {
              const geometrySpec = geometrySpecs[i];
              const {position: positionSpec, dimensions: dimensionsSpec, faces: facesSpec} = geometrySpec;
              positions.push([x + positionSpec[0], y + positionSpec[1], z + positionSpec[2]]);
              dimensions.push(dimensionsSpec);
              faces.push(facesSpec);
            }
          }
        }

        /* const plane = planes[i];
        if (plane !== null) {
          const [x, y, z, value] = plane;

          const planeSpec = templates[value - 1];
          if (!planeSpec) {
            throw new Error('invalid plane value: ' + JSON.stringify(value));
          }
          const {plane: planeName, p, s} = planeSpec;

          const planeInstance = Planes.make(planeName, p, s);
          for (let j = 0; j < planeInstance.meshes.length; j++) {
            const planeMesh = planeInstance.meshes[j];
            const {position, dimensions, rotation} = planeMesh;

            const geometry = new THREE.PlaneGeometry(dimensions[0], dimensions[1]);
            rotation[0] !== 0 && geometry.applyMatrix(new THREE.Matrix4().makeRotationX(rotation[0]));
            rotation[1] !== 0 && geometry.applyMatrix(new THREE.Matrix4().makeRotationY(rotation[1]));
            rotation[2] !== 0 && geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(rotation[2]));
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
              (x + position[0]) + (dimensions[0] / 2),
              (y + position[1]) + (dimensions[1] / 2),
              (z + position[2]) + (dimensions[0] / 2)
            ));

            // front side
            const geometryVertices = [
              geometry.vertices[0],
              geometry.vertices[2],
              geometry.vertices[3],
              geometry.vertices[1],
            ];
            for (let k = 0; k < geometryVertices.length; k++) {
              addVertex(k);
            }
            // back side
            for (let k = geometryVertices.length - 1; k >= 0; k--) {
              addVertex(k);
            }
            function addVertex(k) {
              const vertex = geometryVertices[k];
              const {x, y, z} = vertex;
              vertices.push([x, y, z]);
            }

            const materialIndex = planeMesh.materialIndex;
            const material = typeof materialIndex === 'number' ? planeInstance.materials[materialIndex] : planeInstance.materials;
            const color = BLOCKS[material];
            addFace(color); // front side
            addFace(color); // back side
            function addFace(color) {
              faces.push(color);
            }
          }
        } */
      }
    }
  }

  return {positions, dimensions, faces};
};

voxelBlockModelGenerator.getGeometry = function(mesh, voxelAsync) {
  const {positions, dimensions, faces} = mesh;

  const numFaces = (() => {
    let result = 0;
    for (let i = 0; i < faces.length; i++) {
      const facesSpec = faces[i];
      for (let j = 0; j < 6; j++) {
        const faceSpec = facesSpec[j];
        if (faceSpec) {
          result++;
        }
      }
    }
    return result;
  })();

  const vertices = new Float32Array(numFaces * VERTICES_SIZE_PER_FACE);
  const normals = new Float32Array(numFaces * NORMALS_SIZE_PER_FACE);
  const faceUvs = new Float32Array(numFaces * FACE_UVS_SIZE_PER_FACE);

  let faceIndex = 0;
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const dimension = dimensions[i];
    const facesSpec = faces[i];

    const cubeGeometry = new THREE.CubeGeometry(dimension[0], dimension[1], dimension[2]);
    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(position[0], position[1], position[2]));
    const geometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry);
    const geometryVertices = geometry.getAttribute('position').array;
    const geometryNormals = geometry.getAttribute('normal').array;

    // geoemtry order: east, west, up, down, south, north
    for (let j = 0; j < 6; j++) {
      const faceSpec = facesSpec[j];
      if (faceSpec) {
        vertices.set(
          geometryVertices.slice(j * VERTICES_SIZE_PER_FACE, (j + 1) * VERTICES_SIZE_PER_FACE),
          faceIndex * VERTICES_SIZE_PER_FACE
        );

        normals.set(
          geometryNormals.slice(j * NORMALS_SIZE_PER_FACE, (j + 1) * NORMALS_SIZE_PER_FACE),
          faceIndex * NORMALS_SIZE_PER_FACE
        );

        const faceUvsData = (() => {
          const result = new Float32Array(FACE_UVS_SIZE_PER_FACE);
          const textureUvs = voxelTextureAtlas.getAtlasUvs(voxelAsync.initData.atlasUvs, faceSpec.texture);

          const textureUStart = textureUvs[0][0];
          const textureUEnd = textureUvs[1][0];
          const textureUWidth = textureUEnd - textureUStart;
          const textureWidth = textureUWidth * voxelAsync.initData.atlasWidth;

          const textureVStart = textureUvs[0][1];
          const textureVEnd = textureUvs[2][1];
          const textureVHeight = textureVEnd - textureVStart;
          const textureHeight = textureVHeight * voxelAsync.initData.atlasHeight;

          const faceSpecUvs = faceSpec.uv || [0, 0, textureWidth, textureHeight];
          const projectedTextureUvs = [
            textureUStart + (faceSpecUvs[0] / textureWidth) * textureUWidth,
            1 - (textureVStart + (faceSpecUvs[1] / textureHeight) * textureVHeight),
            textureUStart + (faceSpecUvs[2] / textureWidth) * textureUWidth,
            1 - (textureVStart + (faceSpecUvs[3] / textureHeight) * textureVHeight),
          ];

          // abd
          result[0] = projectedTextureUvs[0];
          result[1] = projectedTextureUvs[3];

          result[2] = projectedTextureUvs[0];
          result[3] = projectedTextureUvs[1];

          result[4] = projectedTextureUvs[2];
          result[5] = projectedTextureUvs[3];

          // bcd
          result[6] = projectedTextureUvs[0];
          result[7] = projectedTextureUvs[1];

          result[8] = projectedTextureUvs[2];
          result[9] = projectedTextureUvs[1];

          result[10] = projectedTextureUvs[2];
          result[11] = projectedTextureUvs[3];

          return result;
        })();
        faceUvs.set(
          faceUvsData,
          faceIndex * FACE_UVS_SIZE_PER_FACE
        );

        faceIndex++;
      }
    }
  }

  return {vertices, normals, faceUvs};
};

/* voxelBlockModelGenerator.getVertices = function(verticesData) {
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

voxelBlockModelGenerator.getNormals = function(vertices) {
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal').array;
  return normals;
};

voxelBlockModelGenerator.getFrameUvs = function(facesData, voxelAsync) {
  const numFaces = facesData.length;
  const sizePerAttribute = numFaces * FACE_VERTICES * MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTES;
  const result = new Float32Array(FRAME_UV_ATTRIBUTES * sizePerAttribute);

  for (let i = 0; i < numFaces; i++) {
    const colorValue = getColorValue(i);
    const faceMaterial = getFaceMaterial(colorValue);

    // frame uvs for one face frame (indexed by attribute, vertex, frame, uv)
    const faceFrameUvs = getPlaneMeshFrameUvs(faceMaterial, i % 2 === 0);

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

  function getFaceMaterial(colorValue) {
    return voxelTextureAtlas.getFaceMaterial(voxelAsync.initData.faceNormalMaterials, colorValue);
  }

  function getPlaneMeshFrameUvs(faceMaterial, even) {
    return voxelTextureAtlas.getPlaneMeshFrameUvs(voxelAsync.initData.planeMeshFrameUvs, faceMaterial, even);
  }
}; */

if (module) {
  module.exports = voxelBlockModelGenerator;
}
