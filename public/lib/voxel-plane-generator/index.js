import THREE from 'three';
import voxelTextureAtlas from '../voxel-texture-atlas/index';
import {BLOCKS as Blocks, PLANES as Planes} from '../../../metadata/index';
import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

const {BLOCKS} = Blocks;
const {VEGETATIONS, WEATHERS, EFFECTS} = Planes;

function voxelPlaneGenerator(voxelAsync) {
  return function({vegetations, effects}, dims) {
    const mesh = voxelPlaneGenerator.getMesh({vegetations, effects}, dims, voxelAsync);
    const {vertices: verticesData, faces: facesData} = mesh;

    const vertices = voxelPlaneGenerator.getVertices(verticesData);
    const normals = voxelPlaneGenerator.getNormals(vertices);
    const frameUvs = voxelPlaneGenerator.getFrameUvs(facesData, voxelAsync);
    return {vertices, normals, frameUvs};
  };
}

voxelPlaneGenerator.getMesh = function({vegetations, effects}, dims, voxelAsync) {
  const vertices = [];
  const faces = [];

  function handlePlanes(planes, templates) {
    for (let i in planes) {
      const plane = planes[i];
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
      }
    }
  }

  handlePlanes(vegetations, VEGETATIONS);
  handlePlanes(effects, EFFECTS);

  return {vertices, faces};
};

voxelPlaneGenerator.getNormals = function(vertices) {
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal').array;
  return normals;
};

voxelPlaneGenerator.getVertices = function(verticesData) {
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

voxelPlaneGenerator.getFrameUvs = function(facesData, voxelAsync) {
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
    return voxelTextureAtlas.getFaceMaterial(voxelAsync.initData.faceNormalMaterials, colorValue);
  }

  function getPlaneMeshFrameUvs(faceMaterial, even) {
    return voxelTextureAtlas.getPlaneMeshFrameUvs(voxelAsync.initData.planeMeshFrameUvs, faceMaterial, even);
  }
};

if (module) {
  module.exports = voxelPlaneGenerator;
}
