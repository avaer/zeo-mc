import React from 'react';

const LOGIN_FONT = '\'Press Start 2P\', cursive';
const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Label extends React.Component {
  onFocus = this.onFocus.bind(this);
  onBlur = this.onBlur.bind(this);

  state = {
    focused: false,
  };

  onFocus() {
    this.setState({
      focused: true
    });
  }

  onBlur() {
    this.setState({
      focused: false
    });
  }

  render() {
    const {focused} = this.state;
    const {onFocus, onBlur} = this;
    return <label style={this.props.style}>
      {this.props.children({focused, onFocus, onBlur})}
    </label>;
  }
}
