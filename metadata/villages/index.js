const Farm = require('./Farm');
const Well = require('./Well');
const HouseSmall = require('./HouseSmall');
const HouseLarge = require('./HouseLarge');
const Blacksmith = require('./Blacksmith');
const ButcherShop = require('./ButcherShop');

const BUILDINGS = [
  Farm,
  Well,
  HouseSmall,
  HouseLarge,
  Blacksmith,
  ButcherShop,
];

const api = {
  BUILDINGS,
};

module.exports = api;
