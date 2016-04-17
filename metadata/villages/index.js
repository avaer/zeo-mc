const Farm = require('./Farm');
const Well = require('./Well');
const HouseSmall = require('./HouseSmall');
const HouseLarge = require('./HouseLarge');
const Blacksmith = require('./Blacksmith');
const ButcherShop = require('./ButcherShop');
const Church = require('./Church');
const Library = require('./Library');

const BUILDINGS = [
  Farm,
  Well,
  HouseSmall,
  HouseLarge,
  Blacksmith,
  ButcherShop,
  Church,
  Library,
];

const api = {
  BUILDINGS,
};

module.exports = api;
