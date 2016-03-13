import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;

export default class MenuEngine extends Engine {
  static NAME = 'menu';
}

module.exports = MenuEngine;
