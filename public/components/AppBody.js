import React from 'react';

import World from './World';

export default class AppBody extends React.Component {
  render() {
    const {stores, engines} = this.props;
    const {window: windowState, world: worldState} = stores;

    const {width, height, pixelRatio, mouse: {position: mousePosition, buttons: mouseButtons}} = windowState;
    const {position, rotation, velocity, nodes, hoverCoords, hoverEndCoords} = worldState;
    const worldProps = {
      width,
      height,
      pixelRatio,

      position,
      rotation,
      velocity,

      nodes,

      mousePosition,
      mouseButtons,
      hoverCoords,
      hoverEndCoords,

      engines
    };

    return (
      <World {...worldProps}/>
    );
  }
}
