import Immutable from 'immutable';

import {UI_MODES} from '../constants/index';

const TEST_SCRIPT = `\
on('frame', frameData => {
  emit('render', frameData);
});
console.log('woot');

export function render() {
  return {
    lol: 'zol'
  };
};

console.log('got exports', exports.render);
`;

export default class Ui extends Immutable.Record({
  mode: UI_MODES.WORLD,
  oldValue: TEST_SCRIPT,
  value: ''
}) {}
