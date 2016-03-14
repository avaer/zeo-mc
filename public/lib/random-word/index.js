import data from './data/compiled.json';

const {adjectives, adverbs, nouns, verbs} = data;

function randomGetter(words) {
  return function() {
    return words[Math.floor(Math.random() * words.length)];
  };
}

export const adjective = randomGetter(adjectives);
export const adverb = randomGetter(adverbs);
export const noun = randomGetter(nouns);
export const verb = randomGetter(verbs);
