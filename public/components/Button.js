import React from 'react';

const LOGIN_FONT = '\'Press Start 2P\', cursive';
const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Button extends React.Component {
  onMouseOver = this.onMouseOver.bind(this);
  onMouseOut = this.onMouseOut.bind(this);
  onFocus = this.onFocus.bind(this);
  onBlur = this.onBlur.bind(this);
  onMouseDown = this.onMouseDown.bind(this);
  onMouseUp = this.onMouseUp.bind(this);

  state = {
    hovered: false,
    focused: false,
    active: false,
  };

  getStyles() {
    const {hovered, focused, active} = this.state;
    const special = hovered || focused;

    return {
      padding: 13,
      marginRight: 10,
      border: '2px solid ' + (!special ? DARK_COLOR : 'transparent'),
      backgroundColor: !special ? 'transparent' : !active ? '#ff2d55' : '#c70024',
      fontFamily: LOGIN_FONT,
      color: !special ? DARK_COLOR : 'white',
      fontSize: '13px',
      lineHeight: 1,
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.1s ease-out',
    };
  }

  onMouseOver() {
    this.setState({
      hovered: true
    });
  }

  onMouseOut() {
    this.setState({
      hovered: false
    });
  }

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

  onMouseDown() {
    this.setState({
      active: true
    });
  }

  onMouseUp() {
    this.setState({
      active: false
    });
  }

  render() {
    return <button
      type={this.props.submit ? 'submit' : 'button'}
      style={this.getStyles()}
      onMouseOver={this.onMouseOver}
      onMouseOut={this.onMouseOut}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      onMouseDown={this.onMouseDown}
      onMouseUp={this.onMouseUp}
      onClick={this.props.onClick}
    >{this.props.children}</button>
  }
}
