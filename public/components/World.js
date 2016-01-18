import React from 'react';

import {Renderer, Scene, PerspectiveCamera} from 'react-three';

export default class World extends React.Component {
  render() {
    return (
      <Renderer width={this.props.width} height={this.props.height}>
        <Scene width={this.props.width} height={this.props.height} camera="maincamera">
          <PerspectiveCamera name="maincamera" {...cameraprops} />
          {/* <Cupcake {...this.props.cupcakedata} /> */}
        </Scene>
      </Renderer>
    );
  }
}
