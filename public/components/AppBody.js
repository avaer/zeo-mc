import React from 'react';
import Immutable from 'immutable'; // XXX

import VoxelScene from './VoxelScene';
import VoxelMenu from './VoxelMenu';

import {DEFAULT_SEED} from '../constants/index';

export default class AppBody extends React.Component {
  render() {

    const {stores, engines} = this.props;
    const {window: windowState, menu: menuState, player: playerState} = stores;
    const {width, height, devicePixelRatio, pathname} = windowState;
    const {open: menuOpen, lastOpenTime: menuLastOpenTime, tab: menuTab, itemIndex: menuItemIndex} = menuState;
    const {inventory} = playerState;

    const voxelSceneProps = {
      width,
      height,

      seed: pathname.replace(/^\//, '') || DEFAULT_SEED,

      engines,
    };

    const voxelMenuProps = {
      width,
      height,
      devicePixelRatio,

      open: menuOpen,
      lastOpenTime: menuLastOpenTime,
      tab: menuTab,
      itemIndex: menuItemIndex,

      inventory,

      engines,
    };

    return (
      <div className='app-body'>
        <VoxelScene {...voxelSceneProps} />
        <VoxelMenu {...voxelMenuProps} />
      </div>
    );
  }
}
