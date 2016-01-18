import React from 'react';

import World from './World';

export default class App extends React.Component {
  render() {
    const {stores} = this.props;
    const {window: windowState, world: worldState} = stores;

    const {width, height, pixelRatio} = windowState;
    const worldProps = {
      width,
      height,
      pixelRatio
    };

    return (
      <World {...worldProps}/>
    );
  }
}
