const WEAPON_NAMES = [
  'portalred',
  'portalblue',
];

export const WEAPONS = (() => {
  const result = {};
  WEAPON_NAMES.forEach((weaponName, i) => {
    result[weaponName] = i + 1;
  });
  return result;
})();
