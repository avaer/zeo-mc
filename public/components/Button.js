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
    const {primary, small} = this.props;
    const {hovered, focused, active} = this.state;
    const special = primary || hovered || focused;

    return {
      padding: !small ? 13 : 5,
      marginRight: 10,
      border: '2px solid ' + (!special ? DARK_COLOR : 'transparent'),
      backgroundColor: (() => {
        if (primary) {
          if (active) {
            return '#219c35';
          } else if (hovered) {
            return '#2ac644';
          } else {
            return '#4cd964';
          }
        } else if (special) {
          if (active) {
            return '#c70024';
          } else {
            return '#ff2d55';
          }
        } else {
          return 'transparent';
        }
      })(),
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
      hovered: false,
      active: false,
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
    return <div style={this.props.style}>
      <button
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
    </div>;
  }
}
