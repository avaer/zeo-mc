import React from 'react';

const LOGIN_FONT = '\'Press Start 2P\', cursive';
const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Button extends React.Component {
  getStyles() {
    const {focused} = this.props;
    return {
      display: 'block',
      height: 32,
      width: '100%',
      border: 0,
      borderBottom: '2px solid ' + (!focused ? LIGHT_COLOR : DARK_COLOR),
      fontFamily: LOGIN_FONT,
      fontSize: '13px',
      lineHeight: '30px',
      textAlign: 'center',
      outline: 'none',
    };
  }

  render() {
    return <input
      type='text'
      style={this.getStyles()}
      value={this.props.value}
      onChange={this.props.onChange}
      onFocus={this.props.onFocus}
      onBlur={this.props.onBlur}
    />;
  }
}
