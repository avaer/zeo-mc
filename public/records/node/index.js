import Immutable from 'immutable';

import * as jsUtils from '../../utils/js/index';
import Vector from '../vector/index';

const AXIS_DIMENSIONS = {
  HORIZONTAL: {
    'xy': 'x',
    'yz': 'z',
    'xz': 'x',
  },
  VERTICAL: {
    'xy': 'y',
    'yz': 'y',
    'xz': 'z',
  },
  DEPTH: {
    'xy': 'z',
    'yz': 'x',
    'xz': 'y',
  }
};

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

  getVolume() {
    let {x, y, z} = box;
    return (x + 1) * (y + 1) * (z + 1);
  }

  removeBlock(removeCoords) {
    const axis = this.getAxis();

    const horizontalDimension = AXIS_DIMENSIONS.HORIZONTAL[axis];
    const hPosition = this.getIn(['position', horizontalDimension]);
    const hBox = this.getIn(['box', horizontalDimension]);
    const hRemove = removeCoords.get(horizontalDimension);

    const verticalDimension = AXIS_DIMENSIONS.VERTICAL[axis];
    const vPosition = this.getIn(['position', verticalDimension]);
    const vBox = this.getIn(['box', verticalDimension]);
    const vRemove = removeCoords.get(verticalDimension);

    const depthDimension = AXIS_DIMENSIONS.DEPTH[axis];
    const dPosition = this.getIn(['position', depthDimension]);
    const dBox = this.getIn(['box', depthDimension]);

    const makeSlicedNode = (h1, v1, h2, v2) => {
      const startCoords = new Vector()
        .set(horizontalDimension, h1)
        .set(verticalDimension, v1)
        .set(depthDimension, dPosition);
      const endCoords = new Vector()
        .set(horizontalDimension, h2)
        .set(verticalDimension, v2)
        .set(depthDimension, dPosition + dBox);
      return Node.fromCoords({startCoords, endCoords});
	};

    const topLeft = makeSlicedNode(hPosition, vRemove, hRemove - 1, vRemove + vBox);
    const topRight = makeSlicedNode(hRemove, vRemove + 1, hPosition + hBox, vPosition + vBox);
    const bottomRight = makeSlicedNode(hRemove + 1, vRemove, hPosition + hBox, vPosition);
    const bottomLeft = makeSlicedNode(hPosition, vPosition, hRemove, vRemove - 1);

    const nodes = [topLeft, topRight, bottomRight, bottomLeft];
    const nonemptyNodes = nodes.filter(node => node.getVolume() > 0);

    return nonemptyNodes;
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
