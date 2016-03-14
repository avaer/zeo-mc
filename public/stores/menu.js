import Immutable from 'immutable';

export default class Menu extends Immutable.Record({
  open: false,
  lastOpenTime: new Date(0),
  tab: 'all',
  itemIndex: null,
}) {}
