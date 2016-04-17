const Farm = require('./Farm');
const HouseSmall = require('./HouseSmall');
const Blacksmith = require('./Blacksmith');

const BUILDINGS = [
  Farm,
  HouseSmall,
  Blacksmith,
];

const api = {
  BUILDINGS,
};

module.exports = api;
