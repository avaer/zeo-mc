var fs = require('fs');
var inflection = require('inflection');

var args = process.argv.slice(2);
var specs = [
  { key: 'adjectives', path: args[0] },
  { key: 'adverbs', path: args[1] },
  { key: 'nouns', path: args[2] },
  { key: 'verbs', path: args[3] },
];

var result = {};
specs.forEach(function(spec) {
  var map = {};
  var list = [];
  fs.readFileSync(spec.path, 'utf8').replace(/\r/g, '').split('\n').map(function(s) {
    return s.toLowerCase();
  }).filter(function(s) {
    return /^[a-z]+$/.test(s);
  }).map(function(s) {
    return inflection.singularize(s);
  }).forEach(function(s) {
    if (!map[s]) {
      map[s] = true;
      list.push(s);
    }
  });
  result[spec.key] = list;
});
console.log(JSON.stringify(result));
