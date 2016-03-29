import React from 'react';
// import ReactDOM from 'react-dom';

/* import Label from './Label';
import Input from './Input'; */
import Button from './Button';
import Avatar from './Avatar';
import Identity from './Identity';

const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Enter extends React.Component {
  onChangeUserButtonClick = this.onChangeUserButtonClick.bind(this);
  onChangeWorldButtonClick = this.onChangeWorldButtonClick.bind(this);
  onPlayButtonClick = this.onPlayButtonClick.bind(this);

  getWrapperStyles() {
    return {
      display: 'flex',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '\'Press Start 2P\', cursive',
    };
  }

  getContainerStyles() {
    return {
      width: 400,
    };
  }

  getHeadingStyles({hovered, disabled}) {
    return {
      // margin: '0 0 10px 0',
      margin: 0,
      // fontSize: '13px',
      color: disabled ? LIGHT_COLOR : hovered ? '#4cd964' : DARK_COLOR,
    };
  }

  getMenuItemStyles() {
    return {
      marginBottom: 20,
      // padding: 5,
      // border: '2px solid ' + DARK_COLOR,
      // borderRadius: 3,
    };
  }

  getMenuItemRowStyles() {
    return {
      display: 'flex',
      // padding: 5,
    };
  }

  getAvatarStyles() {
    return {
      display: 'flex',
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  getIdentityStyles() {
    return {
      display: 'flex',
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  getCardRowTextStyles() {
    return {
      fontSize: '13px',
      lineHeight: '30px',
      flex: 1,
    };
  }

  getConnectorStyles() {
    return {
      position: 'absolute',
      height: '10px',
      width: '2px',
      backgroundColor: '#333',
      marginTop: '35px',
      marginLeft: '19px',
    };
  }

  getButtonsStyles() {
    return {
      display: 'flex',
      marginBottom: 20,
    };
  }

  onChangeUserButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.changeUser();
  }

  onChangeWorldButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.changeWorld();
  }

  onPlayButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.play();
  }

  render() {
    const enterDisabled = !this.props.user;
    const playDisabled = !this.props.user || !this.props.world;

    return <div style={this.getWrapperStyles()}>
      <div style={this.getContainerStyles()}>
        <MenuItem onClick={this.onChangeUserButtonClick}>
          {({hovered}) => <div>
            <h1 style={this.getHeadingStyles({hovered})}>{!this.props.user ? 'Sign in' : 'Change user'}</h1>
            {this.props.user ? <div style={this.getMenuItemRowStyles()}>
              <div style={this.getConnectorStyles()} />
              <Avatar
                style={this.getAvatarStyles()}
                gender={this.props.user.gender}
                value={this.props.user.username}
                size={30}
                special
              />
              <div style={this.getCardRowTextStyles()}>{this.props.user.username}</div>
              {/* <Button onClick={this.onChangeUserButtonClick} small>Change user</Button> */}
            </div> : null}
          </div>}
        </MenuItem>
        <MenuItem onClick={this.onChangeWorldButtonClick} disabled={enterDisabled}>
          {({hovered}) => <div>
            <h1 style={this.getHeadingStyles({hovered, disabled: enterDisabled})}>Choose world</h1>
            {this.props.world ? <div style={this.getMenuItemRowStyles()}>
              <div style={this.getConnectorStyles()} />
              <Identity
                style={this.getIdentityStyles()}
                value={this.props.world.worldname}
                size={30}
                special
              />
              <div style={this.getCardRowTextStyles()}>{this.props.world.worldname}</div>
              {/* <Button onClick={this.onChangeWorldButtonClick} small>Choose world</Button> */}
            </div> : null}
          </div>}
        </MenuItem>
        <MenuItem onClick={this.onPlayButtonClick} disabled={playDisabled}>
          {({hovered}) => <div>
            <h1 style={this.getHeadingStyles({hovered, disabled: playDisabled})}>Play</h1>
          </div>}
        </MenuItem>

        {/* <div style={this.getMenuItemStyles()}>
          <div style={this.getCardRowStyles()}>
            <Button onClick={this.onEnterButtonClick} primary small>Enter</Button>
          </div>
        </div> */}
      </div>
    </div>;
  }
}

class MenuItem extends React.Component {
  onMouseOver = this.onMouseOver.bind(this);
  onMouseOut = this.onMouseOut.bind(this);

  state = {
    hovered: false,
  };

  getStyles() {
    const {disabled} = this.props;
    return {
      padding: '10px 0',
      cursor: !disabled ? 'pointer' : 'default',
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

  render() {
    const {onClick, children} = this.props;
    const {hovered} = this.state;
    const {onMouseOver, onMouseOut} = this;

    return <div style={this.getStyles()} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onClick={onClick}>
      {children({hovered})}
    </div>
  }
}
