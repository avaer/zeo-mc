// contains all forward faces (in terms of scan direction)
const mask = new Int32Array(4096);
// and all backwards faces. needed when there are two transparent blocks
// next to each other.
const invMask = new Int32Array(4096);

// setting 16th bit if transparent
const kTransparentMask    = 0x8000;
const kNoFlagsMask        = 0x7FFF;

function voxelBlockGenerator(voxelAsync) {
  function getType(voxels, offset) {
    return voxels[offset] | 0;
  }

  function isTransparent(type) {
    return voxelAsync.isTransparent(type);
  }

  function isTransparentMasked(v) {
    return (v & kTransparentMask) !== 0;
  }

  function removeFlags(v) {
    return (v & kNoFlagsMask);
  }

  return function(voxels, dims) {
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

      if (mask.length < dimsU * dimsV) {
        throw new Error('mask not big enough');
        // mask = new Int32Array(dimsU * dimsV);
        // invMask = new Int32Array(dimsU * dimsV);
      }

      q[d] =  1;
      x[d] = -1;

      qdimsX  = dimsX  * q[1]
      qdimsXY = dimsXY * q[2]

      // Compute mask
      while (x[d] < dimsD) {
        xd = x[d]
        n = 0;

        for(x[v] = 0; x[v] < dimsV; ++x[v]) {
          for(x[u] = 0; x[u] < dimsU; ++x[u], ++n) {
            // Modified to read through getType()
            let a = xd >= 0      ? getType(voxels, x[0]      + dimsX * x[1]          + dimsXY * x[2]          ) : 0;
            let b = xd < dimsD-1 ? getType(voxels, x[0]+q[0] + dimsX * x[1] + qdimsX + dimsXY * x[2] + qdimsXY) : 0;

            if (a !== b) {
              const aT = isTransparent(a);
              const bT = isTransparent(b);

              aT && (a = a | kTransparentMask);
              bT && (b = b | kTransparentMask);

              // both are transparent, add to both directions
              if (aT && bT) {
                // nothing
              // if a is solid and b is not there or transparent
              } else if (a && (!b || bT)) {
                b = 0;
              // if b is solid and a is not there or transparent
              } else if (b && (!a || aT)) {
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

    // ## enable code to ensure that transparent faces are last in the list
    // var vertex_count = vertices.length;
    // var newFaces = tFaces.map(function(v) {
    //   return [vertex_count+v[0], vertex_count+v[1], vertex_count+v[2], vertex_count+v[3], v[4]]
    // })
    //
    return { vertices: vertices.concat(tVertices), faces: faces.concat(tFaces) };

    // TODO: Try sorting by texture to see if we can reduce draw calls.
    // faces.sort(function sortFaces(a, b) {
    //   return b[4] - a[4];
    // })
    // return { vertices:vertices, faces:faces };
  };
};

if(module) {
  module.exports = voxelBlockGenerator;
}
