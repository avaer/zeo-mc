import React from 'react';

import polygen from '../lib/polygen';

const {floor, random} = Math;

const SIZE = 128;
const MIN_POINTS = 5;
const MAX_POINTS = 10;
const NUM_CELLS = 3;
const VARIANCE = 0.25;

const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Identity extends React.Component {
  state = {
    url: ''
  };

  componentWillMount() {
    this.refreshUrl();
  }

  componentWillReceiveProps() {
    // XXX
  }

  refreshUrl() {
    const url = polygen({
      size: SIZE,
      minPoints: MIN_POINTS,
      maxPoints: MAX_POINTS,
      numCells: NUM_CELLS,
      variance: VARIANCE,
    }).dataUrl();

    this.setState({
      url
    });
  }

  getStyles() {
    const {size, special} = this.props;
    return {
      position: 'relative',
      width: size,
      height: size,
      border: '2px solid ' + (special ? DARK_COLOR : LIGHT_COLOR),
      boxSizing: 'border-box',
    };
  }

  getImageStyles() {
    const {url} = this.state;
    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: DARK_COLOR,
      backgroundImage: 'url(\'' + url + '\')',
      backgroundSize: 'cover',
      imageRendering: 'pixelated',
    };
  }

  render() {
    return <div style={this.props.style} onClick={() => {window.open(this.state.url, '_target');}}>
      <div style={this.getStyles()}>
        <div style={this.getImageStyles()} />
      </div>
    </div>;
  }
}
