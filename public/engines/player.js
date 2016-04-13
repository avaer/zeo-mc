import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;
import Player from '../stores/player';
const {Item} = Player;
import * as randomWord from '../lib/random-word/index';
import {BLOCKS} from '../../metadata/index';

const {floor, random} = Math;

const MIN_ITEMS = 10;
const MAX_ITEMS = 50;

const MIN_ITEM_COUNT = 0;
const MAX_ITEM_COUNT = 10;

const ITEM_DESCRIPTION = 'Final Fantasy VII is a role-playing video game developed and published by Square (now Square Enix) for the PlayStation platform.';

export default class PlayerEngine extends Engine {
  static NAME = 'player';

  init() {
    return {
      'player': _initPlayerState(this.getState('player'))
    };
  }
}

function _initPlayerState(state) {
  const inventoryArray = [];
  ['block', 'item', 'structure', 'weapon', 'materia'].forEach(type => {
    const numItems = MIN_ITEMS + floor(random() * (MAX_ITEMS - MIN_ITEMS));
    for (let i = 0; i < numItems; i++) {
      const variant = (() => {
        if (type === 'block') {
          const blockName = BLOCKS.BASIC[floor(random() * BLOCKS.BASIC.length)];
          const variant = BLOCKS.BLOCKS[blockName];
          return variant;
        } else {
          const variant = randomWord.noun();
          return variant;
        }
      })();
      const count = MIN_ITEM_COUNT + floor(random() * (MAX_ITEM_COUNT - MIN_ITEM_COUNT));
      const description = ITEM_DESCRIPTION;
      const item = new Item({
        type,
        variant,
        count,
        description
      });
      inventoryArray.push(item);
    }
  });
  const inventory = new Immutable.List(inventoryArray);

  return state
    .set('inventory', inventory);
}

module.exports = PlayerEngine;
