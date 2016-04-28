"use strict";

const ITEMS = [
  'greenapple',
  'flare',
  'portalred',
  'portalblue',
];

const WEAPON_NAMES = [
  'portalred',
  'portalblue',
];

const WEAPONS = (() => {
  const result = {};
  WEAPON_NAMES.forEach((weaponName, i) => {
    result[weaponName] = i + 1;
  });
  return result;
})();

const api = {
  ITEMS,
  WEAPONS,
};

module.exports = api;
