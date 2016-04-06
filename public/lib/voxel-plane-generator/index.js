import THREE from 'three';
import {BLOCKS as Blocks, PLANES as Planes} from '../../metadata/index';

const {BLOCKS} = Blocks;
const {VEGETATIONS, WEATHERS, EFFECTS} = Planes;

function voxelPlaneGenerator() {
  return function({vegetations, effects}, dims) {
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
}

if (module) {
  module.exports = voxelPlaneGenerator;
}
