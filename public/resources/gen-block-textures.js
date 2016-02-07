var fs = require('fs');

var main = [
  "bedrock",
  "lava_flow",
  "lava_still",
  "obsidian",
  "stone",
  "dirt",
  "grass_side",
  "grass_side_overlay",
  "grass_side_snowed",
  "grass_top",
  "log_acacia",
  "log_acacia_top",
  "log_big_oak",
  "log_big_oak_top",
  "log_birch",
  "log_birch_top",
  "log_jungle",
  "log_jungle_top",
  "log_oak",
  "log_oak_top",
  "log_spruce",
  "log_spruce_top",
  "leaves_acacia",
  "leaves_big_oak",
  "leaves_birch",
  "leaves_jungle",
  "leaves_oak",
  "leaves_spruce",
];
var files = fs.readdirSync('../img/textures/').filter(function(file) {
  return /\.png$/.test(file) && !/player/.test(file);
}).map(function(file) {
  return file.replace(/\.png$/, '');
}).sort(function(a, b) {
  var d = +!!~main.indexOf(b) - +!!~main.indexOf(a);
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
