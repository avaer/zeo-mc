import React from 'react';

import World from './World';

export default class AppBody extends React.Component {
  render() {
    const {stores, engines} = this.props;
    const {window: windowState, world: worldState} = stores;

    const {width, height, pixelRatio, mouse: {position: mousePosition}} = windowState;
    const {position, rotation, hoverCoords} = worldState;
    const worldProps = {
      width,
      height,
      pixelRatio,

      position,
      rotation,
      mousePosition,
      hoverCoords,

      engines
    };

    return (
      <World {...worldProps}/>
    );
  }
}
