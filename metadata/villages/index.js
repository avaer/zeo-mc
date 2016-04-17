const Farm = require('./Farm');
const Well = require('./Well');
const HouseSmall = require('./HouseSmall');
const HouseLarge = require('./HouseLarge');
const Blacksmith = require('./Blacksmith');

const BUILDINGS = [
  Farm,
  Well,
  HouseSmall,
  HouseLarge,
  Blacksmith,
];

const api = {
  BUILDINGS,
};

module.exports = api;
