import Heap from 'heap';
import * as resources from '../../resources/index';
const {BLOCKS} = resources;

const WATER_VALUE = BLOCKS.BLOCKS['water_still'];
const DEPTH_VALUE = 255;

const {min, floor} = Math;

class VoxelWorldTicker {
  constructor(game) {
    this._game = game;
  }

  tick(ticks) {
    const chunk = this._game.getChunkAtPosition([0, 0, 0]); // XXX iterate over all chunks here
    if (chunk) {
      const chunks = [chunk];
      for (let i = 0; i < ticks; i++) {
        this.tickChunks(chunks);
       }
    }
  }

  tickChunks(chunks) {
    const {chunkSize, voxelUtils} = this._game;

    const getPositionWithValue = (voxels, value) => {
      for (let x = 0; x < chunkSize; x++) {
        for (let y = 0; y < chunkSize; y++) {
          for (let z = 0; z < chunkSize; z++) {
            const index = voxelUtils.getIndex(x, y, z);
            const v = voxels[index];
            if (v === value) {
              return [x, y, z];
            }
          }
        }
      }
      return null;
    };

    const getBlobFrontier = (startPosition, voxels, predicate) => {
      const inHeap = new Heap(([ax, ay, az], [bx, by, bz]) => {
        return by - ay;
      });
      const outHeap = new Heap(([ax, ay, az], [bx, by, bz]) => {
        return ay - by;
      });

      function canFlowOut([x, y, z]) {
        return [
          [x - 1, y, z], // left
          [x + 1, y, z], // right
          [x, y - 1, z], // bottom
          // [x, y + 1, z], // top
          [x, y, z - 1], // back
          [x, y, z + 1], // front
        ].some(nextPosition => {
          const [x, y, z] = nextPosition;
          if (isInChunkBounds(x, y, z)) {
            const index = voxelUtils.getIndex(x, y, z);
            const value = voxels[index];
            return !value;
          } else {
            return false;
          }
        });
      }

      const frontier = [startPosition];
      const seenIndex = {};
      while (frontier.length > 0) {
        const position = frontier.shift();
        const [x, y, z] = position;
        const index = voxelUtils.getIndex(x, y, z);
        if (!(index in seenIndex)) {
          if (predicate(position)) {
            inHeap.push(position);
            if (canFlowOut(position)) {
              outHeap.push(position);
            }

            [
              [x - 1, y, z], // left
              [x + 1, y, z], // right
              [x, y - 1, z], // bottom
              [x, y + 1, z], // top
              [x, y, z - 1], // back
              [x, y, z + 1], // front
            ].forEach(nextPosition => {
              const [x, y, z] = nextPosition;
              if (isInChunkBounds(x, y, z)) {
                frontier.push(nextPosition);
              }
            });
          }

          seenIndex[index] = true;
        }
      }
      return {inHeap, outHeap};
    };

    const tickBlobFrontier = (blobFrontier, voxels, depths) => {
      const {inHeap, outHeap} = blobFrontier;
      const {nodes: inNodes} = inHeap;
      const {nodes: outNodes} = outHeap;

      /* function canPourIn(maxDepth) {
        let currentDepth = 0;
        for (let i = 0; i < outNodes.length; i++) {
          const outPosition = outNodes[i];
          const [x, y, z] = outPosition;
          const outIndex = voxelUtils.getIndex(x, y, z);
          const outValue = voxels[outIndex];
          if (outValue === WATER_VALUE) {
            const outDepth = depths[outIndex];
            const needDepth = maxDepth - currentDepth;
            const takeDepth = min(outDepth, needDepth);

            currentDepth += takeDepth;

            if (currentDepth >= maxDepth) {
              break;
            }
          }
        }
        return currentDepth;
      } */

      function pourIn(maxDepth) {
        let currentDepth = 0;
        let outPosition;
        while (outPosition = outHeap.pop()) {
          const [x, y, z] = outPosition;
          const outIndex = voxelUtils.getIndex(x, y, z);
          const outValue = voxels[outIndex];
          if (outValue === WATER_VALUE) {
            const outDepth = depths[outIndex];
            const needDepth = maxDepth - currentDepth;
            const takeDepth = min(outDepth, needDepth);

            currentDepth += takeDepth;

            if (takeDepth === outDepth) {
              voxels[outIndex] = 0;
              depth[outIndex] = 0;
            } else {
              depth[outIndex] = outDepth - takeDepth;
            }

            if (currentDepth >= maxDepth) {
              break;
            }
          }
        }
        return currentDepth;
      }

      // tick each out position in order
      let outPosition;
      while (outPosition = outHeap.pop()) {
        // make sure that the out value has not been poured away yet
        const [x, y, z] = outPosition;
        const outIndex = voxelUtils.getIndex(x, y, z)
        const outValue = voxels[outIndex];
        if (outValue === WATER_VALUE) {
          const canPourDown () => {
            if (isInChunkBounds(x, y - 1, z)) {
              const bottomIndex = voxelUtils.getIndex(x, y - 1, z);
              const bottomValue = voxels[bottomIndex];
              return !bottomValue;
            } else {
              return false;
            }
          };

          const pourDown = () => {
            const outDepth = depths[outIndex];
            const inDepth = pourIn(outDepth);
            voxels[bottomIndex] = WATER_VALUE;
            depths[bottomIndex] = inDepth;
          };

          const pourSideways = () => {
            // find fillable nextPositions
            const nextPositions = [
              [x - 1, y, z], // left
              [x + 1, y, z], // right
              [x, y, z - 1], // back
              [x, y, z + 1], // front
            ].filter(nextPosition => {
              const [x, y, z] = nextPosition;
              if (isInChunkBounds(x, y, z)) {
                const nextIndex = voxelUtils.getIndex(x, y, z);
                const nextValue = voxels[nextIndex];
                return !nextValue || nextValue === WATER_VALUE;
              } else {
                return false;
              }
            });

            if (nextPositions.length > 0) {
              // calculate how much depth we need for the nextPositions
              const nextPositionNeedDepths = nextPositions.map(nextPosition => {
                const [x, y, z] = nextPosition;
                const nextIndex = voxelUtils.getIndex(x, y, z);
                const nextValue = voxels[nextIndex];
                if (!nextValue) {
                  return DEPTH_VALUE;
                } else if (nextValue === WATER_VALUE) {
                  const nextDepth = depths[nextIndex];
                  const remainingDepth = DEPTH_VALUE - nextDepth;
                  return remainingDepth;
                } else {
                  return 0;
                }
              });
              const needDepth = (() => {
                let result = 0;
                for (let i = 0; i < nextPositionDepths.length; i++) {
                  result += nextPositionDepths[i];
                }
                return result;
              })();

              // pour in the depth we need
              const inDepth = pourIn(needDepth);
              const inDepthPerNextPosition = floor(inDepth / nextPositions.length);

              // pour out evenly to the nextPositions
              let outDepth = 0;
              for (let i = 0; i < nextPositions.length; i++) {
                const nextPosition = nextPositions[i];
                const [x, y, z] = nextPosition;
                const nextIndex = voxelUtils.getIndex(x, y, z);

                const nextValue = voxels[nextIndex];
                if (nextValue !== WATER_VALUE) {
                  voxels[nextIndex] = WATER_VALUE;
                }
                depths[nextIndex] += inDepthPerNextPosition;

                outDepth += inDepthPerNextPosition;
              }

              // use up any remainder outDepth on nextPositions in order of neediness
              if (outDepth < inDepth) {
                const nextPositionsSortedByNeedDepths = nextPositionNeedDepths
                  .map((needDepth, i) => [needDepth, i])
                  .sort(([aDepth,], [bDepth,]) => bDepth - aDepth)
                  .map(([,i]) => nextPositions[i]);

                for (let i = 0; i < nextPositionsSortedByNeedDepths.length; i++) {
                  const nextPosition = nextPositionsSortedByNeedDepths[i];
                  const [x, y, z] = nextPosition;
                  const nextIndex = voxelUtils.getIndex(x, y, z);

                  depths[nextIndex]++;

                  outDepth++;

                  if (outDepth < inDepth) {
                    continue;
                  } else {
                    break;
                  }
                }
              }
            }
          };

          if (canPourDown()) {
            pourDown();
          } else {
            pourSideways();
          }
        }
      }
    };

    const isInChunkBounds = (x, y, z) => (
      x >= 0 && x < chunkSize &&
      y >= 0 && y < chunkSize &&
      z >= 0 && z < chunkSize
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const {voxels, depths} = chunk;

      const startPosition = getPositionWithValue(voxels, WATER_VALUE); // XXX iterate over all start positions here
      if (startPosition) {
        const blobFrontier = getBlobFrontier(startPosition, voxels, position => {
          const [x, y, z] = position;
          const index = voxelUtils.getIndex(x, y, z);
          const value = voxels[index];
          return value === WATER_VALUE;
        });

        if (!window.startPosition) { // XXX
          window.startPosition = startPosition;
          window.blobFrontier = blobFrontier;
          console.log('got blob frontier');
        }

        tickBlobFrontier(blobFrontier, voxels, depths);
      }
    }
  }
}

function voxelWorldTicker(game) {
  return new VoxelWorldTicker(game);
}

module.exports = voxelWorldTicker;
