import Immutable from 'immutable';

import Window from './window';
import Login from './login';
import Menu from './menu';
import Player from './player';

export default class Stores extends Immutable.Record({
  window: new Window(),
  login: new Login(),
  menu: new Menu(),
  player: new Player(),
}) {}
