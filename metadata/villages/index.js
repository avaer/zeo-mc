const Farm = require('./Farm');
const Well = require('./Well');
const LampPost = require('./LampPost');
const HouseSmall = require('./HouseSmall');
const HouseLarge = require('./HouseLarge');
const Blacksmith = require('./Blacksmith');
const ButcherShop = require('./ButcherShop');
const Church = require('./Church');
const Library = require('./Library');

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
  const heightMap = opts.heightMap;
  const usedMap = opts.usedMap;
  const chunkNoise = opts.chunkNoise;
  const wellNoiseX = opts.wellNoiseX;
  const wellNoiseZ = opts.wellNoiseZ;
  const onPoint = opts.onPoint;

  const chunkX = position.chunkX;
  const chunkZ = position.chunkZ;

  const chunkNoiseN = chunkNoise.in2D(chunkX, chunkZ);
  if (chunkNoiseN < VILLAGE_RATE_PER_CHUNK) {
    const wellNoiseXN = wellNoiseX.in2D(chunkX, chunkZ);
    const wellX = startX + floor(wellNoiseXN * chunkSize) + WELL_OFFSET[0];
    const wellNoiseZN = wellNoiseZ.in2D(chunkX, chunkZ);
    const wellZ = startZ + floor(villageWellNoiseZN * chunkSize) + WELL_OFFSET[1];
    // XXX ensure there is room for the well before trying to make it
    VILLAGES.makeBuilding({
      type: 'well',
      position: [wellX, wellZ],
      onPoint
    });
    // XXX generate worms and additional buildings in NEWS directions
  }
}

function _makeBuilding(buildingType, opts) {
  const type = opts.type;
  const position = opts.position;
  const onPoint = opts.onPoint;

  const Building = BUILDING_INDEX[type];
  const building = new Building();
  const layers = building.layers;
  const offset = building.offset;
  // XXX place the building on the highest terrain height of the horizontal blocks it occupies
  // XXX generate a stone base for the building if needed
  // XXX reify layers to onPoint() block value calls
  // XXX make sure to handle the bottom-up offsetted well generation case
}

const api = {
  BUILDINGS,
  make,
};

module.exports = api;
