import Immutable from 'immutable';

import Window from './window';
import Ui from './ui';
import World from './world';

export default class Stores extends Immutable.Record({
  window: new Window(),
  ui: new Ui(),
  world: new World()
}) {}
