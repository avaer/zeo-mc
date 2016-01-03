const Rwg = require('random-word-generator');

function generate({minCharacters = 3, maxCharacters = 10} = {}) {
  function makePattern() {
    function makePatternCharacter() {
      return Math.random() < 0.5 ? 'c' : 'v';
    }

    let result = makePatternCharacter().toUpperCase();
    const numCharacters = minCharacters + Math.floor(Math.random() * (maxCharacters - minCharacters));
    while (result.length < numCharacters) {
      result += makePatternCharacter();
      result = result.replace(/(c)c{1,}/gi, '$1').replace(/(v)v{2,}/gi, '$1v')
    }
    return result;
  }

  const rwg = new Rwg();
  rwg.pattern(makePattern());
  return rwg.generate();
}

const api = {
  generate
};

module.exports = api;
