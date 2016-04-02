import React from 'react';

import MainMenu from './MainMenu';
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
    const {mode, creatingUser, creatingWorld, user: loginUser, world: loginWorld, worlds: loginWorlds, error: loginError} = loginState;
    const {open: menuOpen, lastOpenTime: menuLastOpenTime, tab: menuTab, itemIndex: menuItemIndex, dragItemIndex: menuDragItemIndex, dragCoords: menuDragCoords} = menuState;
    const {inventory} = playerState;

    const loginProps = {
      creatingUser,
      error: loginError,

      engines,
    };

    const enterProps = {
      creatingWorld,
      worlds: loginWorlds,
      error: loginError,

      engines,
    };

    const mainMenuProps = {
      user: loginUser,
      world: loginWorld,
      // error: loginError,

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
        {mode === 'mainMenu' ? <MainMenu {...mainMenuProps} /> : null}
        {mode === 'login' ? <Login {...loginProps} /> : null}
        {mode === 'enter' ? <Enter {...enterProps} /> : null}
        {mode === 'live' ? <div>
          <VoxelScene {...voxelSceneProps} />
          <VoxelMenu {...voxelMenuProps} />
        </div> : null}
      </div>
    );
  }
}
