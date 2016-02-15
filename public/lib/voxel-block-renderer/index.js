const voxelAsync = require('../voxel-async/index');

function voxelBlockRenderer(data, THREE) {
  const blocks = voxelAsync.blockMesher(data.voxels, data.dims);

  const geometry = (() => {
    function getFaceVertexUvs(i) {
      const vs = [
        blocks.vertices[i*4+0],
        blocks.vertices[i*4+1],
        blocks.vertices[i*4+2],
        blocks.vertices[i*4+3]
      ]
      const spans = {
        x0: vs[0][0] - vs[1][0],
        x1: vs[1][0] - vs[2][0],
        y0: vs[0][1] - vs[1][1],
        y1: vs[1][1] - vs[2][1],
        z0: vs[0][2] - vs[1][2],
        z1: vs[1][2] - vs[2][2]
      }
      const size = {
        x: Math.max(Math.abs(spans.x0), Math.abs(spans.x1)),
        y: Math.max(Math.abs(spans.y0), Math.abs(spans.y1)),
        z: Math.max(Math.abs(spans.z0), Math.abs(spans.z1))
      }
      let width, height;
      if (size.x === 0) {
        if (spans.y0 > spans.y1) {
          width = size.y;
          height = size.z;
        } else {
          width = size.z;
          height = size.y;
        }
      }
      if (size.y === 0) {
        if (spans.x0 > spans.x1) {
          width = size.x;
          height = size.z;
        } else {
          width = size.z;
          height = size.x;
        }
      }
      if (size.z === 0) {
        if (spans.x0 > spans.x1) {
          width = size.x;
          height = size.y;
        } else {
          width = size.y;
          height = size.x;
        }
      }
      if ((size.z === 0 && spans.x0 < spans.x1) || (size.x === 0 && spans.y0 > spans.y1)) {
        return [
          new THREE.Vector2(height, 0),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, width),
          new THREE.Vector2(height, width)
        ]
      } else {
        return [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, height),
          new THREE.Vector2(width, height),
          new THREE.Vector2(width, 0)
        ]
      }
    }

    const geometry = new THREE.Geometry();

    geometry.vertices.length = 0;
    geometry.faces.length = 0;

    for (let i = 0; i < blocks.vertices.length; ++i) {
      const q = blocks.vertices[i];
      geometry.vertices.push(new THREE.Vector3(q[0], q[1], q[2]));
    } 
    
    for (let i = 0; i < blocks.faces.length; i++) {
      const q = blocks.faces[i];

      const f = new THREE.Face3(q[0], q[1], q[2]);
      f.color = new THREE.Color(q[3]);

      geometry.faces.push(f);
    }
    for (let i = 0, l = blocks.faces.length / 2; i < l; i++) {
      const faceVertexUvs = getFaceVertexUvs(i);
      geometry.faceVertexUvs[0].push([faceVertexUvs[0], faceVertexUvs[1], faceVertexUvs[3]]);
      geometry.faceVertexUvs[0].push([faceVertexUvs[1], faceVertexUvs[2], faceVertexUvs[3]]);
    }

    // compute vertex colors for ambient occlusion
    const light = new THREE.Color(0xffffff)
    const shadow = new THREE.Color(0x505050)
    for (let i = 0; i < geometry.faces.length; ++i) {
      let face = geometry.faces[i];
      // facing up
      if (face.normal.y === 1) {
        face.vertexColors = [light, light, light, light];
      }
      // facing down
      else if (face.normal.y === -1) {
        face.vertexColors = [shadow, shadow, shadow, shadow];
      }
      // facing right
      else if (face.normal.x === 1) {
        face.vertexColors = [shadow, light, light, shadow];
      }
      // facing left
      else if (face.normal.x === -1) {
        face.vertexColors = [shadow, shadow, light, light];
      }
      // facing backward
      else if (face.normal.z === 1) {
        face.vertexColors = [shadow, shadow, light, light];
      }
      // facing forward
      else {
        face.vertexColors = [shadow, light, light, shadow];
      }
    }

    geometry.computeFaceNormals();

    /* geometry.verticesNeedUpdate = true
    geometry.elementsNeedUpdate = true
    geometry.normalsNeedUpdate = true

    geometry.computeBoundingBox()
    geometry.computeBoundingSphere() */

    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry); // XXX clean this up to instantiate BufferGeometry directly
    return bufferGeometry;
  })();

  const material = new THREE.MeshNormalMaterial();

  const mesh = (() => {
    const mesh  = new THREE.Mesh(geometry, material);
    mesh.doubleSided = false;

    return mesh;
  })();

  return mesh;
}

module.exports = voxelBlockRenderer;
