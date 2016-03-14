import Immutable from 'immutable';

import Window from './window';
import Menu from './menu';
import Player from './player';

export default class Stores extends Immutable.Record({
  window: new Window(),
  menu: new Menu(),
  player: new Player(),
}) {}
