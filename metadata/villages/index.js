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

function make(opts) {
  const position = opts.position;
  const chunkSize = opts.chunkSize;
  const getHeight = opts.getHeight;
  const getLand = opts.getLand;
  const getTree = opts.getTree;
  const chunkNoise = opts.chunkNoise;
  const wellNoiseX = opts.wellNoiseX;
  const wellNoiseZ = opts.wellNoiseZ;
  const setVoxel = opts.setVoxel;

  const startX = position[0];
  const startZ = position[1];

  const chunkNoiseN = chunkNoise.in2D(startX, startZ);
  if (chunkNoiseN < VILLAGE_RATE_PER_CHUNK) {
    const wellNoiseXN = wellNoiseX.in2D(startX, startZ);
    const wellX = startX + floor(wellNoiseXN * chunkSize) + WELL_OFFSET[0];
    const wellNoiseZN = wellNoiseZ.in2D(startX, startZ);
    const wellZ = startZ + floor(wellNoiseZN * chunkSize) + WELL_OFFSET[1];
    const wellPosition = [wellX, wellZ];

    // attempt to build main well
    if (_canBuild({
      type: 'well',
      position: wellPosition,
      getLand,
      getTree,
    })) {
      // build main well
      _makeBuilding({
        type: 'well',
        position: wellPosition,
        getHeight,
        setVoxel,
      });

      // XXX build roads and the rest of the buildings here
    }
  }
}

function _canBuild(opts) {
  const type = opts.type;
  const position = opts.position;
  const getLand = opts.getLand;
  const getTree = opts.getTree;

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
  }, (x, z) => getLand(x, z) && !getTree(x, z));
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
  // XXX make sure to handle the bottom-up offsetted well generation case
}

const api = {
  BUILDINGS,
  make,
};

module.exports = api;
