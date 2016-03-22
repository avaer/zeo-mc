function voxelParticleMesher(data, THREE) {
  const {vertices: verticesData} = data;
  const numVertices = verticesData.length;
  if (numVertices > 0) {
    const geometry = (() => {
      const geometry = new THREE.BufferGeometry();

      const vertices = voxelParticleMesher.getVertices(verticesData);
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

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
  const result = new Float32Array(numVertices * 3);

  for (let i = 0; i < numVertices; i++) {
    const vertex = verticesData[i];
    result[i * 3 + 0] = vertex[0];
    result[i * 3 + 1] = vertex[1];
    result[i * 3 + 2] = vertex[2];
  }

  return result;
}

module.exports = voxelParticleMesher;
