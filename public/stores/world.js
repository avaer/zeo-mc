import Immutable from 'immutable';

import Vector from '../records/vector/index';

export default class World extends Immutable.Record({
  position: new Vector(0, 0, 0)
}) {}
