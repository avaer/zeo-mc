import Immutable from 'immutable';

import * as jsUtils from '../../utils/js/index';
import Vector from '../vector/index';

export default class Node extends Immutable.Record({
  id: '',
  position: new Vector(),
  box: new Vector(),
}) {
  constructor(id, position, box) {
    super({id, position, box});
  }

  getAxis() {
    const {box: {x, y, z}} = this;

    if (x === 0) {
      return 'yz';
    } else if (y === 0) {
      return 'xz';
    } else if (z === 0) {
      return 'xy';
    } else {
      return null;
    }
  }
}
Node.fromCoords = ({startCoords, endCoords}) => {
  let {x: x1, y: y1, z: z1} = startCoords;
  let {x: x2, y: y2, z: z2} = endCoords;

  if (x1 > x2) {
    [x1, x2] = [x2, x1];
  }
  if (y1 > y2) {
    [y1, y2] = [y2, y1];
  }
  if (z1 > z2) {
    [z1, z2] = [z2, z1];
  }

  const id = jsUtils.makeGuid();
  const position = new Vector(x1, y1, z1);
  const box = new Vector(x2 - x1, y2 - y1, z2 - z1);

  return new Node(id, position, box);
};
