import React from 'react';
import Immutable from 'immutable'; // XXX

import World from './World';
import Editor from './Editor';
import Node from './Node';

import {UI_MODES} from '../constants/index';

export default class AppBody extends React.Component {
  render() {
    const {stores, engines} = this.props;
    const {ui: uiState, window: windowState, world: worldState} = stores;

    const {mode, value, oldValue} = uiState;
    const {width, height, pixelRatio, mouse: {position: mousePosition, buttons: mouseButtons}} = windowState;
    const {position, rotation, velocity, tool, nodes, hoverCoords, hoverEndCoords} = worldState;
    const worldProps = {
      width,
      height,
      pixelRatio,

      position,
      rotation,
      velocity,
      tool,

      nodes,

      mousePosition,
      mouseButtons,
      hoverCoords,
      hoverEndCoords,

      engines,
    };

    const editorProps = {
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
    };

    return (
      <div className='app-body'>
        <World {...worldProps} />
        <Editor {...editorProps} />
        <Node {...nodeProps} />
      </div>
    );
  }
}
