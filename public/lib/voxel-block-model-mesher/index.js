import {FRAME_UV_ATTRIBUTE_SIZE, FRAME_UV_ATTRIBUTES} from '../../constants/index';

function voxelBlockModelMesher(data, textureAtlas, THREE) {
  const {vertices, normals, uvs/*, frameUvs */} = data;

  if (vertices.length > 0) {
    const geometry = (() => {
      const geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
      // voxelPlaneMesher.applyFrameUvs(geometry, frameUvs, THREE);
      return geometry;
    })();

    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  } else {
    return null;
  }
}

/* voxelBlockModelMesher.applyFrameUvs = function(geometry, frameUvs, THREE) {
  const sizePerAttribute = frameUvs.length / FRAME_UV_ATTRIBUTES;
  for (let i = 0; i < FRAME_UV_ATTRIBUTES; i++) {
    geometry.addAttribute(
      'frameUv' + i,
      new THREE.BufferAttribute(frameUvs.slice(i * sizePerAttribute, (i + 1) * sizePerAttribute), FRAME_UV_ATTRIBUTE_SIZE)
    );
  }
}; */

module.exports = voxelBlockModelMesher;
