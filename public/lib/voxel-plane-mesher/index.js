var THREE = require('three');

var blocks = require('../../resources/blocks/index');
var BLOCKS = blocks.BLOCKS;

var planes = require('../../resources/planes/index');
var VEGETATIONS = planes.VEGETATIONS;
var WEATHERS = planes.WEATHERS;

function voxelPlaneMesher() {
  return function({vegetations, weathers}, dims) {
    const vertices = [];
    const faces = [];

    for (let i = 0; i < weathers.length; i++) {
      const weather = weathers[i];
      const [x, y, z, value] = weather;

      const spec = WEATHERS[value - 1];
      const {plane: planeName} = spec;

      const plane = planes.make(planeName);
      for (let j = 0; j < plane.meshes.length; j++) {
        const planeMesh = plane.meshes[j];
        const {position, dimensions, rotation} = planeMesh;

        const geometry = new THREE.PlaneGeometry(dimensions[0], dimensions[1]);
        rotation[0] !== 0 && geometry.rotateX(rotation[0]);
        rotation[1] !== 0 && geometry.rotateY(rotation[1]);
        rotation[2] !== 0 && geometry.rotateZ(rotation[2]);
        geometry.translate(
          (x + position[0]) + dimensions[0] / 2,
          (y + position[1]) + dimensions[1] / 2,
          (z + position[2]) + dimensions[0] / 2
        );

        for (let k = 0, l = geometry.vertices.length; k < l; k++) {
          const vertex = geometry.vertices[k];
          const {x, y, z} = vertex;
          vertices.push([x, y, z]);
        }

        const color = BLOCKS[plane.materials[planeMesh.materialIndex]];
        faces.push(color);
      }
    }

    return {vertices, faces};
  };
}

if (module) {
  module.exports = voxelPlaneMesher;
}
