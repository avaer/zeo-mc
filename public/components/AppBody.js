import React from 'react';

import Login from './Login';
import VoxelScene from './VoxelScene';
import VoxelMenu from './VoxelMenu';

import {DEFAULT_SEED} from '../constants/index';

export default class AppBody extends React.Component {
  render() {

    const {stores, engines} = this.props;
    const {window: windowState, login: loginState, menu: menuState, player: playerState} = stores;
    const {width, height, devicePixelRatio, pathname} = windowState;
    const {loggedIn, loggingIn, error} = loginState;
    const {open: menuOpen, lastOpenTime: menuLastOpenTime, tab: menuTab, itemIndex: menuItemIndex, dragItemIndex: menuDragItemIndex, dragCoords: menuDragCoords} = menuState;
    const {inventory} = playerState;

    const loginProps = {
      loggedIn,
      loggingIn,
      error,

      engines,
    };

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
      dragItemIndex: menuDragItemIndex,
      dragCoords: menuDragCoords,

      inventory,

      engines,
    };

    return (
      <div className='app-body'>
        {!loggedIn ? <Login {...loginProps} /> : null}
        {loggedIn ? <VoxelScene {...voxelSceneProps} /> : null}
        {loggedIn ? <VoxelMenu {...voxelMenuProps} /> : null}
      </div>
    );
  }
}
