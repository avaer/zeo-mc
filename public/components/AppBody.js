import React from 'react';
import Immutable from 'immutable'; // XXX

import VoxelScene from './VoxelScene';
import VoxelMenu from './VoxelMenu';

import {DEFAULT_SEED} from '../constants/index';

export default class AppBody extends React.Component {
  render() {

    const {stores, engines} = this.props;
    const {window: windowState, menu: menuState} = stores;
    const {width, height, devicePixelRatio, pathname} = windowState;
    const {open: menuOpen, lastOpenTime: menuLastOpenTime, tab: menuTab, item: menuItem} = menuState;

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
      item: menuItem,

      engines,
    };

    /* const editorProps = {
      value,
      visible: mode === UI_MODES.EDITOR,
      focused: mode === UI_MODES.EDITOR,

      onChange: value => {
        engines.editorChange({value});
      },
      onSave: value => {
        engines.editorSave({value});
      },
      onQuit: () => {
        engines.editorQuit();
      }
    };

    const nodeProps = {
      src: oldValue,
      state: new Immutable.Map({lol: 'zol'}),
    }; */

    return (
      <div className='app-body'>
        <VoxelScene {...voxelSceneProps} />
        <VoxelMenu {...voxelMenuProps} />
        {/* <Editor {...editorProps} />
        <Node {...nodeProps} /> */}
      </div>
    );
  }
}
