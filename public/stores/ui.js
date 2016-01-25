import Immutable from 'immutable';

import {UI_MODES} from '../constants/index';

export default class Ui extends Immutable.Record({
  mode: UI_MODES.WORLD,
  oldValue: `function lol() {

}`,
  value: ''
}) {}
