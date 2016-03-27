import React from 'react';

import Login from './Login';
import Enter from './Enter';
import VoxelScene from './VoxelScene';
import VoxelMenu from './VoxelMenu';

import {DEFAULT_SEED} from '../constants/index';

export default class AppBody extends React.Component {
  render() {

    const {stores, engines} = this.props;
    const {window: windowState, login: loginState, menu: menuState, player: playerState} = stores;
    const {width, height, devicePixelRatio, pathname} = windowState;
    const {loggedIn, loggingIn, creatingAccount, entered, entering, error: loginError} = loginState;
    const live = loggedIn && entered;
    const {open: menuOpen, lastOpenTime: menuLastOpenTime, tab: menuTab, itemIndex: menuItemIndex, dragItemIndex: menuDragItemIndex, dragCoords: menuDragCoords} = menuState;
    const {inventory} = playerState;

    const loginProps = {
      loggedIn,
      loggingIn,
      creatingAccount,
      error: loginError,

      engines,
    };

    const enterProps = {
      entered,
      entering,
      error: loginError,

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
        {/* <Avatar value='zoe'/> */}
        {!loggedIn ? <Login {...loginProps} /> : null}
        {loggedIn && !entered ? <Enter {...enterProps} /> : null}
        {live ? <VoxelScene {...voxelSceneProps} /> : null}
        {live ? <VoxelMenu {...voxelMenuProps} /> : null}
      </div>
    );
  }
}
