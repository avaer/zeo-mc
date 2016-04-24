const Farm = require('./Farm');
const Well = require('./Well');
const LampPost = require('./LampPost');
const HouseSmall = require('./HouseSmall');
const HouseLarge = require('./HouseLarge');
const Blacksmith = require('./Blacksmith');
const ButcherShop = require('./ButcherShop');
const Church = require('./Church');
const Library = require('./Library');

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

function makeBuilding(buildingType, opts) {
  const {type, position, onPoint} = opts;
  const Building = BUILDING_INDEX[type];
  const building = new Building();
  const {layers, offset} = building;
  // XXX place the building on the highest terrain height of the horizontal blocks it occupies
  // XXX generate a stone base for the building if needed
  // XXX reify layers to onPoint() block value calls
  // XXX make sure to handle the bottom-up offsetted well generation case
}

const api = {
  BUILDINGS,
  makeBuilding,
};

module.exports = api;
