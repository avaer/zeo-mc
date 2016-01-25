import React from 'react';

import World from './World';
import Editor from './Editor';

export default class AppBody extends React.Component {
  render() {
    const {stores, engines} = this.props;
    const {window: windowState, world: worldState} = stores;

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

      engines
    };

    const editorProps = {
      visible: false
    };

    return (
      <div className='app-body'>
        <World {...worldProps} />
        <Editor {...editorProps} />
      </div>
    );
  }
}
