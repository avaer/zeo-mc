import THREE from 'three';
import {BLOCK_MODELS} from '../../../metadata/index';
import voxelUtils from '../../../lib/voxel-utils/index';
import voxelTextureAtlas from '../voxel-texture-atlas/index';
import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

const MASK_SIZE = 4096;
const mask = new Int32Array(MASK_SIZE);
const invMask = new Int32Array(MASK_SIZE);

const TRANSPARENT_MASK = 0x8000;
const NO_FLAGS_MASK = 0x7FFF;

function voxelBlockGenerator(voxelAsync) {
  const vu = voxelUtils({chunkSize: voxelAsync.initData.chunkSize});

  return function({voxels, metadata}, dims) {
    const mesh = voxelBlockGenerator.getMesh({voxels, metadata}, dims, voxelAsync, vu);
    const {vertices: verticesData, faces: facesData} = mesh;

    const vertices = voxelBlockGenerator.getVertices(verticesData);
    const normals = voxelBlockGenerator.getNormals(vertices);
    const frameUvs = voxelBlockGenerator.getFrameUvs(facesData, normals, voxelAsync);
    return {vertices, normals, frameUvs};
  };
};

voxelBlockGenerator.getMesh = function({voxels, metadata}, dims, voxelAsync, vu) {
  var vertices = [], faces = [], tVertices = [], tFaces = []
    , dimsX = dims[0]
    , dimsY = dims[1]
    , dimsXY = dimsX * dimsY;

  //Sweep over 3-axes
  for(var d=0; d<3; ++d) {
    var i, j, k, l, w, W, h, n, c
      , u = (d+1)%3
      , v = (d+2)%3
      , x = [0,0,0]
      , q = [0,0,0]
      , du = [0,0,0]
      , dv = [0,0,0]
      , dimsD = dims[d]
      , dimsU = dims[u]
      , dimsV = dims[v]
      , qdimsX, qdimsXY
      , xd

    q[d] =  1;
    x[d] = -1;

    qdimsX  = dimsX  * q[1]
    qdimsXY = dimsXY * q[2]

    if (MASK_SIZE < dimsU * dimsV) {
      throw new Error('mask buffer not big enough');
    }

    // Compute mask
    while (x[d] < dimsD) {
      xd = x[d]
      n = 0;

      for(x[v] = 0; x[v] < dimsV; ++x[v]) {
        for(x[u] = 0; x[u] < dimsU; ++x[u], ++n) {
          let a, b, aM, bM;
          if (xd >= 0) {
            const aOffset = x[0]      + dimsX * x[1]          + dimsXY * x[2];
            a = voxels[aOffset];
            aM = metadata ? !!vu.getBlockMetadataModel(metadata.buffer, aOffset) : false;
          } else {
            a = 0;
            aM = false;
          }
          if (xd < dimsD-1) {
            const bOffset = x[0]+q[0] + dimsX * x[1] + qdimsX + dimsXY * x[2] + qdimsXY;
            b = voxels[bOffset];
            bM = metadata ? !!vu.getBlockMetadataModel(metadata.buffer, bOffset) : false;
          } else {
            b = 0;
            bM = false;
          }

          if (a !== b || isTranslucent(a) || isTranslucent(b)) {
            const aT = isTransparent(a);
            const bT = isTransparent(b);

            aT && (a = a | TRANSPARENT_MASK);
            bT && (b = b | TRANSPARENT_MASK);

            // both are transparent and not models, add to both directions
            if (aT && bT && !aM && !bM) {
              // nothing
            // if a is solid and not a model and b is not there or transparent or a model
            } else if (a && !aM && (!b || bT || bM)) {
              b = 0;
            // if b is solid and node a model and a is not there or transparent or a model
            } else if (b && !bM && (!a || aT || aM)) {
              a = 0;
            // dont draw this face
            } else {
              a = 0;
              b = 0;
            }
          } else {
            a = 0;
            b = 0;
          }

          mask[n] = a;
          invMask[n] = b;
        }
      }

      ++x[d];

      // Generate mesh for mask using lexicographic ordering
      function generateMesh(mask, dimsV, dimsU, vertices, faces, clockwise) {
        clockwise = clockwise === undefined ? true : clockwise;
        var n, j, i, c, w, h, k, du = [0,0,0], dv = [0,0,0];
        n = 0;
        for (j=0; j < dimsV; ++j) {
          for (i=0; i < dimsU; ) {
            c = mask[n];
            if (!c) {
              i++;  n++; continue;
            }

            //Compute width
            w = 1;
            while (c === mask[n+w] && i+w < dimsU) w++;

            //Compute height (this is slightly awkward)
            for (h=1; j+h < dimsV; ++h) {
              k = 0;
              while (k < w && c === mask[n+k+h*dimsU]) k++
              if (k < w) break;
            }

            // Add quad
            // The du/dv arrays are reused/reset
            // for each iteration.
            du[d] = 0; dv[d] = 0;
            x[u]  = i;  x[v] = j;

            if (clockwise) {
            // if (c > 0) {
              dv[v] = h; dv[u] = 0;
              du[u] = w; du[v] = 0;
            } else {
              // c = -c;
              du[v] = h; du[u] = 0;
              dv[u] = w; dv[v] = 0;
            }

            // ## enable code to ensure that transparent faces are last in the list
            if (!isTransparentMasked(c)) {
              const vertex_count = vertices.length;
              vertices.push([x[0],             x[1],             x[2]            ]);
              vertices.push([x[0]+du[0],       x[1]+du[1],       x[2]+du[2]      ]);
              vertices.push([x[0]+du[0]+dv[0], x[1]+du[1]+dv[1], x[2]+du[2]+dv[2]]);
              vertices.push([x[0]      +dv[0], x[1]      +dv[1], x[2]      +dv[2]]);

              const color = removeFlags(c);
              faces.push(color);
            } else {
              const vertex_count = tVertices.length;
              tVertices.push([x[0],             x[1],             x[2]            ]);
              tVertices.push([x[0]+du[0],       x[1]+du[1],       x[2]+du[2]      ]);
              tVertices.push([x[0]+du[0]+dv[0], x[1]+du[1]+dv[1], x[2]+du[2]+dv[2]]);
              tVertices.push([x[0]      +dv[0], x[1]      +dv[1], x[2]      +dv[2]]);

              const color = removeFlags(c);
              tFaces.push(color);
            }

            //Zero-out mask
            W = n + w;
            for(l=0; l<h; ++l) {
              for(k=n; k<W; ++k) {
                mask[k+l*dimsU] = 0;
              }
            }

            //Increment counters and continue
            i += w; n += w;
          }
        }
      }
      generateMesh(mask, dimsV, dimsU, vertices, faces, true)
      generateMesh(invMask, dimsV, dimsU, vertices, faces, false)
    }
  }

  return {vertices: vertices.concat(tVertices), faces: faces.concat(tFaces)};

  function isTransparent(type) {
    return voxelAsync.isTransparent(type);
  }

  function isTransparentMasked(v) {
    return (v & TRANSPARENT_MASK) !== 0;
  }

  function isTranslucent(type) {
    return voxelAsync.isTranslucent(type);
  }

  function removeFlags(v) {
    return v & NO_FLAGS_MASK;
  }
};

voxelBlockGenerator.getVertices = function(verticesData) {
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

voxelBlockGenerator.getNormals = function(vertices) {
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal').array;
  return normals;
};

voxelBlockGenerator.getFrameUvs = function(facesData, normals, voxelAsync) {
  const numFaces = facesData.length;
  const sizePerAttribute = numFaces * FACE_VERTICES * MATERIAL_FRAMES * 2 / FRAME_UV_ATTRIBUTES;
  const result = new Float32Array(FRAME_UV_ATTRIBUTES * sizePerAttribute);

  for (let i = 0; i < numFaces; i++) {
    const colorValue = getColorValue(i);
    const normalDirection = getNormalDirection(i);
    const faceMaterial = getFaceNormalMaterial(colorValue, normalDirection);

    // frame uvs for one face frame (6 copies of each 4 attribute floats in sequence)
    const faceFrameUvs = getFaceFrameUvs(faceMaterial);

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

  function getNormalDirection(i) {
    const normalIndex = i * FACE_VERTICES * 3;
    if      (normals[normalIndex + 0] === 1)  return 1; // z === 1
    else if (normals[normalIndex + 1] === 1)  return 2; // y === 1
    else if (normals[normalIndex + 1] === -1) return 3; // y === -1
    else if (normals[normalIndex + 2] === -1) return 4; // x === -1
    else if (normals[normalIndex + 2] === 1)  return 5; // x === 0
    else                                      return 0;
  }

  function getFaceNormalMaterial(colorValue, normalDirection) {
    return voxelTextureAtlas.getFaceNormalMaterial(voxelAsync.initData.faceNormalMaterials, colorValue, normalDirection);
  }

  function getFaceFrameUvs(faceMaterial) {
    return voxelTextureAtlas.getBlockMeshFaceFrameUvs(voxelAsync.initData.blockMeshFaceFrameUvs, faceMaterial);
  }
};

if(module) {
  module.exports = voxelBlockGenerator;
}
