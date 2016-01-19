import Immutable from 'immutable';

import Point from '../records/point/index';
import Vector from '../records/vector/index';

import {WORLD_SIZE} from '../constants/index';

export default class World extends Immutable.Record({
  position: new Vector(WORLD_SIZE / 2, 0, 0),
  rotation: new Point(0, 0),
  velocity: new Vector(0, 0, 0),
  hoverCoords: null,
  hoverEndCoords: null
}) {}
