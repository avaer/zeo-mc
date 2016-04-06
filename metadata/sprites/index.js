"use strict";

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
  WEAPONS,
};

module.exports = api;
