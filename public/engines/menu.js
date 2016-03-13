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
      .set('tab', tab));
  }
}

module.exports = MenuEngine;
