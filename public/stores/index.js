import Immutable from 'immutable';

import Window from './window';
import Menu from './menu';

export default class Stores extends Immutable.Record({
  window: new Window(),
  menu: new Menu(),
}) {}
