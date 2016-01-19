import Immutable from 'immutable';

import * as jsUtils from '../../utils/js/index';
import Vector from '../vector/index';

class Block extends Immutable.Record({
  x: 0,
  y: 0,
  z: 0,
  node: null
}) {
  constructor(x, y, z, node) {
    super({x, y, z, node});
  }

  add(b) {
    const a = this;
    return new Block(a.x + b.x, a.y + b.y, a.z + b.z, a.node);
  }

  subtract(b) {
    const a = this;
    return new Block(a.x - b.x, a.y - b.y, a.z - b.z, a.node);
  }
}

export default class Node extends Immutable.Record({
  id: '',
  blocks: new Immutable.List(),
  position: new Vector()
}) {
  constructor(id, blocks, position) {
    super({id, blocks, position});
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
  const blockList = (() => {
    const list = [];
    for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
        for (let k = z1; k <= z2; k++) {
          const block = new Block(i, j, k, this);
          list.push(block);
        }
      }
    }
    return list;
  })();
  const position = (() => {
    const x = jsUtils.min(blockList, ({x}) => x);
    const y = jsUtils.min(blockList, ({y}) => y);
    const z = jsUtils.min(blockList, ({z}) => z);
    return new Vector(x, y, z);
  })();
  const blocks = (() => {
    const list = blockList.map(block => block.subtract(position));
    return new Immutable.List(list);
  })();

  return new Node(id, blocks, position);
};
