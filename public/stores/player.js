import Immutable from 'immutable';

export default class Player extends Immutable.Record({
  inventory: Immutable.List()
}) {}

class Item extends Immutable.Record({
  type: '',
  name: '',
  count: 0
}) {}

Player.Item = Item;
