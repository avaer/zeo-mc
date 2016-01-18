import Immutable from 'immutable';

import Point from '../records/point/index';
import Vector from '../records/vector/index';

export default class World extends Immutable.Record({
  position: new Vector(0, 0, 0),
  rotation: new Point(0, 0)
}) {}
