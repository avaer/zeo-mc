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
  onLogoutButtonClick = this.onLogoutButtonClick.bind(this);

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
      // marginBottom: 10,
      // fontSize: '13px',
      color: disabled ? LIGHT_COLOR : hovered ? '#4cd964' : DARK_COLOR,
    };
  }

  getMenuItemRowStyles() {
    return {
      display: 'flex',
      marginTop: 10,
      marginLeft: 20,
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

  /* getConnectorLeftStyles() {
    return {
      position: 'absolute',
      height: '15px',
      width: '2px',
      backgroundColor: '#333',
      marginTop: 0,
      marginLeft: -10,
    };
  }

  getConnectorBottomStyles() {
    return {
      position: 'absolute',
      height: '2px',
      width: '10px',
      backgroundColor: '#333',
      marginTop: 15,
      marginLeft: -10,
    };
  } */

  getButtonsStyles() {
    return {
      marginTop: 20,
      // display: 'flex',
      // marginBottom: 20,
    };
  }

  onChangeUserButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.changeUser();
  }

  onChangeWorldButtonClick() {
    const {user} = this.props;
    if (user) {
      const {engines} = this.props;
      const loginEngine = engines.getEngine('login');
      loginEngine.changeWorld();
    }
  }

  onPlayButtonClick() {
    const {user, world} = this.props;
    if (user && world) {
      const {engines} = this.props;
      const loginEngine = engines.getEngine('login');
      loginEngine.play();
    }
  }

  onLogoutButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.logout();
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
            {this.props.user && this.props.world ? <div style={this.getMenuItemRowStyles()}>
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

        {this.props.user ? <div style={this.getButtonsStyles()}>
          <Button onClick={this.onLogoutButtonClick} small>Logout</Button>
        </div> : null}
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
