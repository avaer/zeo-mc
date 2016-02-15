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
var unmainTextures = [
  /forest/,
  /jungle/
];
var files = fs.readdirSync('../../img/textures/blocks/').filter(function(file) {
  return /\.png$/.test(file);
}).map(function(file) {
  return file.replace(/\.png$/, '');
}).sort(function(a, b) {
  function mainTexturesMatch(t) {
    function textureMatch(texture, t) {
      if (typeof texture === 'string') {
        return t === texture;
      } else if (texture instanceof RegExp) {
        return texture.test(t);
      } else {
        return false;
      }
    };

    return mainTextures.some(function(texture) {
      return textureMatch(texture, t);
    }) && !unmainTextures.some(function(texture) {
      return textureMatch(texture, t);
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
