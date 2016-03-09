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

    const getBoundingBlob = (startPosition, predicate) => {
      const result = [];
      const frontier = [startPosition];
      const seenIndex = {};
      while (frontier.length > 0) {
        const position = frontier.shift();
        const index = voxelUtils.getIndex(position[0], position[1], position[2]);
        if (!(index in seenIndex)) {
          if (predicate(position)) {
            result.push(position);

            [
              [position[0] - 1, position[1], position[2]], // left
              [position[0] + 1, position[1], position[2]], // right
              [position[0], position[1] - 1, position[2]], // top
              [position[0], position[1] + 1, position[2]], // bottom
              [position[0], position[1], position[2] - 1], // back
              [position[0], position[1], position[2] + 1], // front
            ].forEach(nextPosition => {
              if (isInBounds(nextPosition)) {
                frontier.push(nextPosition);
              }
            });
          }

          seenIndex[index] = true;
        }
      }
      return result;
    };

    const isInBounds = position => (
      position[0] >= 0 && position[0] < chunkSize &&
      position[1] >= 0 && position[1] < chunkSize &&
      position[2] >= 0 && position[2] < chunkSize
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const {voxels} = chunk;

      const startPosition = getPositionWithValue(voxels, WATER_STILL);
      if (startPosition) {
        const boundingBlob = getBoundingBlob(startPosition, position => {
          const index = voxelUtils.getIndex(position[0], position[1], position[2]);
          const value = voxels[index];
          return value === WATER_STILL;
        });
        console.log('got bounding blob', {startPosition: startPosition.join(','), boundingBlob}); // XXX
      }
    }
  }
}

function voxelWorldTicker(game) {
  return new VoxelWorldTicker(game);
}

module.exports = voxelWorldTicker;
