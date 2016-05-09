 "use strict";

const Blocks = require('../blocks/index');
const BLOCKS = Blocks.BLOCKS;

const Farm = require('./Farm');
const Well = require('./Well');
const LampPost = require('./LampPost');
const HouseSmall = require('./HouseSmall');
const HouseLarge = require('./HouseLarge');
const Blacksmith = require('./Blacksmith');
const ButcherShop = require('./ButcherShop');
const Church = require('./Church');
const Library = require('./Library');

const floor = Math.floor;
const min = Math.min;

const VILLAGE_RATE_PER_CHUNK = 0.1;
const WELL_OFFSET = [2, 2];

const BUILDINGS = [
  Farm,
  Well,
  LampPost,
  HouseSmall,
  HouseLarge,
  Blacksmith,
  ButcherShop,
  Church,
  Library,
];
const BUILDING_INDEX = (() => {
  const result = {};
  BUILDINGS.forEach(Building => {
    const NAME = Building.NAME;
    result[NAME] = Building;
  });
  return result;
})();
const BUILDING_RATE = 0.1;

const ROAD_DIRECTIONS = [ 'north', 'east', 'south', 'west'];
const ROAD_DIRECTION_START_OFFSETS = {
  'north': [0, -3],
  'east': [4, 0],
  'south': [0, 4],
  'west': [-3, 0],
};
const ROAD_DIRECTION_INCREMENTS = {
  'north': [0, -1],
  'east': [1, 0],
  'south': [0, 1],
  'west': [-1, 0],
};
const ROAD_PREV_DIRECTIONS = {
  'north': 'west',
  'east': 'north',
  'south': 'east',
  'west': 'south',
};
const ROAD_NEXT_DIRECTIONS = {
  'north': 'east',
  'east': 'south',
  'south': 'west',
  'west': 'north',
};
const ROAD_RATE = 0.5;
const MAX_ROAD_LENGTH_MIN = 4;
const MAX_ROAD_LENGTH_MAX = 32;
const ROAD_LENGTH_MIN = 4;
const ROAD_LENGTH_MAX = 16;
const MAX_BUILDING_SIZE = 16;
const BLOCK_PADDING = MAX_ROAD_LENGTH_MAX + MAX_BUILDING_SIZE;

function make(opts) {
  const position = opts.position;
  const chunkSize = opts.chunkSize;
  const getHeight = opts.getHeight;
  const getLand = opts.getLand;
  const getTree = opts.getTree;
  const chunkNoise = opts.chunkNoise;
  const wellNoiseX = opts.wellNoiseX;
  const wellNoiseZ = opts.wellNoiseZ;
  const roadNoise = opts.roadNoise;
  const roadMaxLengthNoise = opts.roadMaxLengthNoise;
  const roadLengthNoise = opts.roadLengthNoise;
  const roadDirectionNoise = opts.roadDirectionNoise;
  const buildingNoise = opts.buildingNoise;
  const buildingTypeNoise = opts.buildingTypeNoise;
  const setVoxel = opts.setVoxel;

  const startX = position[0];
  const startZ = position[1];
  const paddedChunkSize = chunkSize + BLOCK_PADDING;
  const villageMap = new Uint8Array(paddedChunkSize * paddedChunkSize);
  const getVillage = _makeGetVillage({
    villageMap,
    position,
    paddedChunkSize,
  });
  const setVillage = _makeSetVillage({
    villageMap,
    position,
    paddedChunkSize,
  });

  const chunkNoiseN = chunkNoise.in2D(startX, startZ);
  if (chunkNoiseN < VILLAGE_RATE_PER_CHUNK) {
    const wellPosition = _getWellPosition({
      startX,
      startZ,
      chunkSize,
      wellNoiseX,
      wellNoiseZ,
    });

    // attempt to build main well
    if (_canBuild({
      type: 'well',
      position: wellPosition,
      getLand,
      getTree,
      getVillage,
    })) {
      // build main well
      _makeBuilding({
        type: 'well',
        position: wellPosition,
        getHeight,
        setVoxel,
        setVillageMap,
      });

      _makeRoads({
        wellPosition,
        roadNoise,
        roadMaxLengthNoise,
        roadLengthNoise,
        buildingNoise,
        buildingTypeNoise,
        roadDirectionNoise,
        getHeight,
        setVoxel,
        setVillageMap,
      });
    }
  }
}

function _getWellPosition(opts) {
  const startX = opts.startX;
  const startZ = opts.startZ;
  const chunkSize = opts.chunkSize;
  const wellNoiseX = opts.wellNoiseX;
  const wellNoiseZ = opts.wellNoiseZ;

  const wellNoiseXN = wellNoiseX.in2D(startX, startZ);
  const wellX = startX + floor(wellNoiseXN * chunkSize) + WELL_OFFSET[0];
  const wellNoiseZN = wellNoiseZ.in2D(startX, startZ);
  const wellZ = startZ + floor(wellNoiseZN * chunkSize) + WELL_OFFSET[1];
  const wellPosition = [wellX, wellZ];
  return wellPosition;
}

function _canBuild(opts) {
  const type = opts.type;
  const position = opts.position;
  const getLand = opts.getLand;
  const getTree = opts.getTree;
  const getVillage = opts.getVillage;

  const startX = position[0];
  const startZ = position[1];

  const Building = BUILDING_INDEX[type];
  const building = new Building();
  const dimensions = building.getDimensions();
  const width = dimensions.width;
  const depth = dimensions.depth;
  return _everyHorizontalPoint({
    startX,
    startZ,
    width,
    depth,
  }, (x, z) => getLand(x, z) && !getTree(x, z) && !getVillage(x, z));
}

function _forEachHorizontalPoint(opts, fn) {
  const startX = opts.startX;
  const startZ = opts.startZ;
  const width = opts.width;
  const depth = opts.depth;

  for (let z = startZ; z < startZ + depth; z++) {
    for (let x = startX; x < startX + width; x++) {
      fn(x, z);
    }
  }
}

function _everyHorizontalPoint(opts, predicate) {
  const startX = opts.startX;
  const startZ = opts.startZ;
  const width = opts.width;
  const depth = opts.depth;

  for (let z = startZ; z < startZ + depth; z++) {
    for (let x = startX; x < startX + width; x++) {
      if (!predicate(x, z)) {
        return false;
      }
    }
  }
  return true;
}

function _makeBuilding(opts) {
  const type = opts.type;
  const position = opts.position;
  const getHeight = opts.getHeight;
  const setVoxel = opts.setVoxel;
  const setVillageMap = opts.setVillageMap;

  const startX = position[0];
  const startZ = position[1];

  const Building = BUILDING_INDEX[type];
  const building = new Building();
  const dimensions = building.getDimensions();
  const width = dimensions.width;
  const depth = dimensions.depth;
  const yOffset = building.getYOffset();
  const layers = building.getLayers();

  const yBase = (() => {
    let result = 0;
    _forEachHorizontalPoint({
      startX,
      startZ,
      width,
      depth,
    }, (x, z) => {
      const h = getHeight(x, z);
      if (h > result) {
        result = h;
      }
    });
    return result;
  })();
  const startY = yBase + yOffset;

  _makeBase();
  _makeLayers();
  _logBase();

  function _makeBase() {
    _forEachHorizontalPoint({
      startX,
      startZ,
      width,
      depth,
    }, (x, z) => {
      const h = getHeight(x, z);
      for (let y = h + 1; y < startY; y++) {
        setVoxel(x, y, z, BLOCKS['cobblestone']);
      }
    });
  }

  function _makeLayers() {
    const numLayers = layers.length;
    for (let i = 0; i < numLayers; i++) {
      const y = startY + i;

      _forEachHorizontalPoint({
        startX,
        startZ,
        width,
        depth,
      }, (x, z) => {
        const j = x - startX;
        const k = z - startZ;
        const block = building.getBlock(j, i, k);
        if (block) {
          const value = block.type;
          const model = block.model;
          const direction = block.direction;
          const depth = block.depth;

          setVoxel(x, y, z, value, {model, direction, depth});
        }
      });
    }
  }

  function _logBase() {
    _forEachHorizontalPoint({
      startX,
      startZ,
      width,
      depth,
    }, (x, z) => {
      setVillageMap(x, z);
    });
  }

  // XXX make sure to handle the bottom-up offsetted well generation case
}

function _makeRoads(opts) {
  const wellPosition = opts.wellPosition;
  const roadNoise = opts.roadNoise;
  const roadMaxLengthNoise = opts.roadMaxLengthNoise;
  const roadLengthNoise = opts.roadLengthNoise;
  const roadDirectionNoise = opts.roadDirectionNoise;
  const buildingNoise = opts.buildingNoise;
  const buildingTypeNoise = opts.buildingTypeNoise;
  const getHeight = opts.getHeight;
  const setVoxel = opts.setVoxel;
  const setVillageMap = opts.setVillageMap;

  function _makeRoad(opts) {
    const startPosition = opts.startPosition;
    const direction = opts.direction;
    const length = opts.length;
    const maxLength = opts.maxLength;

    const startX = startPosition[0];
    const startZ = startPosition[1];
    const increment = ROAD_DIRECTION_INCREMENTS[direction];
    const incrementX = increment[0];
    const incrementZ = increment[1];

    const localLength = min(
      ROAD_LENGTH_MIN + floor(maxLengthNoiseN * (ROAD_LENGTH_MAX - ROAD_LENGTH_MIN)),
      maxLength - prevLength
    );
    for (let i = 0; i < localLength; i++) {
      const x = startX + i * incrementX;
      const z = startZ + i * incrementZ;
      const y = getHeight(x, z);
      setVoxel(x, y, z, BLOCKS['cobblestone']);
      setVillageMap(x, z);
      // XXX double the road width
      // XXX prematurely halt road generation if hitting a used part of the village
      // XXX generate building here, on the opposite side of the road curvature
    }
    const newLength = prevLength + localLength;
    const remainingLength = maxLength - newLength;
    if (remainingLength > 0) {
      const endX = startX + localLength * incrementX;
      const endZ = startZ + localLength * incrementZ;
      const nextStartPosition = [endX, endZ];
      const nextDirection = (() => {
        const nextDirectionOffset = (() => {
          const directionNoiseN = roadDirectionNoise.in2D(endX, endZ);
          if (directionNoiseN < 1/3) {
            return -1;
          } else if (directionNoiseN < 2/3) {
            return 0;
          } else {
            return 1;
          }
        })();
        if (nextDirectionOffset === -1) {
          return ROAD_PREV_DIRECTIONS[direction];
        } else if (nextDirectionOffset === 1) {
          return ROAD_NEXT_DIRECTIONS[direction];
        } else {
          return direction;
        }
      })();

      _makeRoad({
        startPosition: nextStartPosition,
        direction: nextDirection,
        length: newLength,
        maxLength,
      });
    }
  }

  ROAD_DIRECTIONS.forEach(direction => {
    const startOffset = ROAD_DIRECTION_START_OFFSETS[direction];
    const startX = wellPosition[0] + startOffset[0];
    const startZ = wellPosition[1] + startOffset[1];
    const startPosition = [startX, startZ];

    const roadNoiseN = roadNoise.in2D(startX, startZ);
    if (roadNoiseN < ROAD_RATE) {
      const maxLengthNoiseN = roadMaxLengthNoise.in2D(startX, startZ);
      const maxLength = MAX_ROAD_LENGTH_MIN + floor(maxLengthNoiseN * (MAX_ROAD_LENGTH_MAX - MAX_ROAD_LENGTH_MIN));

      _makeRoad({
        startPosition,
        direction,
        length: 0,
        maxLength,
      });
    }
  });
}

function _makeGetVillage(opts) {
  const villageMap = opts.villageMap;
  const position = opts.position;
  const paddedChunkSize = opts.paddedChunkSize;

  const startX = position[0] - paddedChunkSize;
  const startZ = position[1] - paddedChunkSize;

  return (x, z) => {
    const rawX = x - startX;
    const rawZ = z - startZ;
    const idx = rawX + (rawZ * paddingSize);
    return villageMap[idx] !== 0;
  };
}

function _makeSetVillage(opts) {
  const villageMap = opts.villageMap;
  const position = opts.position;
  const paddedChunkSize = opts.paddedChunkSize;

  const startX = position[0] - paddedChunkSize;
  const startZ = position[1] - paddedChunkSize;

  return (x, z) => {
    const rawX = x - startX;
    const rawZ = z - startZ;
    const idx = rawX + (rawZ * paddingSize);
    villageMap[idx] = 1;
  };
}

const api = {
  BUILDINGS,
  make,
};

module.exports = api;
