var fs = require('fs');

var mainTextures = [
  "bedrock",
  "lava_flow",
  "lava_still",
  "obsidian",
  "stone",
  "dirt",
  /grass/,
  /log/,
  /leaves/,
];
var files = fs.readdirSync('../../img/textures/').filter(function(file) {
  return /\.png$/.test(file) && !/player/.test(file);
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
