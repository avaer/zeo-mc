const Farm = require('./Farm');
const Well = require('./Well');
const HouseSmall = require('./HouseSmall');
const Blacksmith = require('./Blacksmith');

const BUILDINGS = [
  Farm,
  Well,
  HouseSmall,
  Blacksmith,
];

const api = {
  BUILDINGS,
};

module.exports = api;
