var fs = require('fs');

var mainTextures = [
  // blocks
  'bedrock',
  /lava/,
  'obsidian',
  'stone',
  'dirt',
  /grass/,
  /^(?:gravel|sand|red_sand)$/,
  /log/,
  /leaves/,
  /water/,

  // planes
  /beetroots/,
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
  /double_plant/,
  /fire/,
];
var unmainTextures = [
  /forest/,
  /jungle/
];
var files = fs.readdirSync('../../public/img/textures/blocks/').filter(function(file) {
  return /\.png$/.test(file);
}).map(function(file) {
  return file.replace(/\.png$/, '');
});

var result = {};
var i = 1;
files.forEach(function(file) {
  result[file] = i++;
});

console.log(JSON.stringify(result, null, 2));
