import * as resources from '../../resources/index';
const {BLOCKS} = resources;

const WATER_STILL = BLOCKS.BLOCKS['water_still'];

class VoxelWorldTicker {
  constructor(game) {
    this._game = game;
  }

  tick(ticks) {
    const chunk = this._game.getChunkAtPosition([0, 0, 0]); // XXX go through all chunks here
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

    const getBlobFrontier = (startPosition, predicate) => {
      const topFrontier = Array(chunkSize * chunkSize);
      const bottomFrontier = Array(chunkSize * chunkSize);

      function getPlaneIndex(x, z) {
        return x + chunkSize * z;
      }

      const frontier = [startPosition];
      const seenIndex = {};
      while (frontier.length > 0) {
        const position = frontier.shift();
        const [x, y, z] = position;
        const index = voxelUtils.getIndex(x, y, z);
        if (!(index in seenIndex)) {
          if (predicate(position)) {
            const planeIndex = getPlaneIndex(x, z);
            if (topFrontier[planeIndex] === undefined || y < topFrontier[planeIndex]) {
              topFrontier[planeIndex] = y;
            }
            if (bottomFrontier[planeIndex] === undefined || y > bottomFrontier[planeIndex]) {
              bottomFrontier[planeIndex] = y;
            }

            [
              [x - 1, y, z], // left
              [x + 1, y, z], // right
              [x, y - 1, z], // top
              [x, y + 1, z], // bottom
              [x, y, z - 1], // back
              [x, y, z + 1], // front
            ].forEach(nextPosition => {
              if (isInBounds(nextPosition)) {
                frontier.push(nextPosition);
              }
            });
          }

          seenIndex[index] = true;
        }
      }
      return {top: topFrontier, bottom: bottomFrontier}; // XXX should compute a top max-heap and a bottom min-heap instead
    };

    const isInBounds = ([x, y, z]) => (
      x >= 0 && x < chunkSize &&
      y >= 0 && y < chunkSize &&
      z >= 0 && z < chunkSize
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const {voxels} = chunk;

      const startPosition = getPositionWithValue(voxels, WATER_STILL);
      if (startPosition) {
        const blobFrontier = getBlobFrontier(startPosition, position => {
          const index = voxelUtils.getIndex(position[0], position[1], position[2]);
          const value = voxels[index];
          return value === WATER_STILL;
        });
        if (!window.lol) { // XXX
          console.log('got blob frontier', {startPosition: startPosition.join(','), blobFrontier});
          window.lol = true;
        }
      }
    }
  }
}

function voxelWorldTicker(game) {
  return new VoxelWorldTicker(game);
}

module.exports = voxelWorldTicker;
