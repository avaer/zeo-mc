const POINTS_PER_VERTEX = 20;
const POINTS_SIZE = 0.0125;

function voxelParticleMesher(data, THREE) {
  const {vertices: verticesData, offsets: offsetsData} = data;
  const numVertices = verticesData.length;
  if (numVertices > 0) {
    const geometry = (() => {
      const geometry = new THREE.BufferGeometry();

      const vertices = voxelParticleMesher.getVertices(verticesData);
      const offsets = voxelParticleMesher.getOffsets(offsetsData)
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.addAttribute('offset', new THREE.BufferAttribute(offsets, 1));

      return geometry;
    })();

    const material = new THREE.MeshNormalMaterial();

    const points = new THREE.Points(geometry, material);
    return points;
  } else {
    return null;
  }
}

voxelParticleMesher.getVertices = function(verticesData) {
  const numVertices = verticesData.length;
  const result = new Float32Array(numVertices * POINTS_PER_VERTEX * 3);
  for (let i = 0; i < numVertices; i++) {
    const vertex = verticesData[i];
    for (let j = 0; j < POINTS_PER_VERTEX; j++) {
      result[i * POINTS_PER_VERTEX * 3 + j * 3 + 0] = vertex[0];
      result[i * POINTS_PER_VERTEX * 3 + j * 3 + 1] = vertex[1] - (j * POINTS_SIZE);
      result[i * POINTS_PER_VERTEX * 3 + j * 3 + 2] = vertex[2];
    }
  }
  return result;
};

voxelParticleMesher.getOffsets = function(offsetsData) {
  const numVertices = offsetsData.length;
  const result = new Float32Array(numVertices * POINTS_PER_VERTEX);
  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < POINTS_PER_VERTEX; j++) {
      result[i * POINTS_PER_VERTEX + j] = offsetsData[i];
    }
  }
  return result;
};

module.exports = voxelParticleMesher;
