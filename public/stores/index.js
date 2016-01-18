import Immutable from 'immutable';

import Window from './window';
import World from './world';

export default class Stores extends Immutable.Record({
  window: new Window(),
  world: new World()
}) {}
