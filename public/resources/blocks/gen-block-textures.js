var fs = require('fs');

var mainTextures = [
  // blocks
  'bedrock',
  'lava_flow',
  'lava_still',
  'obsidian',
  'stone',
  'dirt',
  /grass/,
  /log/,
  /leaves/,

  // planes
  /carrots/,
  /nether_wart/,
  /potatoes/,
  /wheat/,
  'deadbush',
  /fern/,
  /flower/,
  /melon_stem/,
  'mushroom_brown',
  'mushroom_red',
  /pumpkin_stem/,
  /sapling/,
  /rain/,
  'reeds',
  /tallgrass/,
  /double_plant/
];
var files = fs.readdirSync('../../img/textures/blocks/').filter(function(file) {
  return /\.png$/.test(file);
}).map(function(file) {
  return file.replace(/\.png$/, '');
}).sort(function(a, b) {
  function mainTexturesMatch(t) {
    return mainTextures.some(function(mainTexture) {
      if (typeof mainTexture === 'string') {
        return t === mainTexture;
      } else if (mainTexture instanceof RegExp) {
        return mainTexture.test(t);
      } else {
        return false;
      }
    });
  }

  var d = +mainTexturesMatch(b) - +mainTexturesMatch(a);
  if (d !== 0) {
    return d;
  } else {
    return a.localeCompare(b);
  }
});

var result = {};
var i = 1;
files.forEach(function(file) {
  result[file] = i++;
});

console.log(JSON.stringify(result, null, 2));
