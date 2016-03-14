import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;

export default class MenuEngine extends Engine {
  static NAME = 'menu';

  toggleOpen() {
    this.updateState('menu', state => {
      const {open: oldOpen} = state;
      const newOpen = !oldOpen;
      const lastOpenTime = new Date();
      return state
        .set('open', newOpen)
        .set('lastOpenTime', lastOpenTime);
    });
  }

  selectTab(tab) {
    this.updateState('menu', state => state
      .set('tab', tab)
      .set('item', null));
  }

  selectItem(item) {
    if (item) {
      const {x, y} = item;
      this.updateState('menu', state => state
        .set('item', {x, y}));
    } else {
      this.updateState('menu', state => state
        .set('item', null));
    }
  }
}

module.exports = MenuEngine;
