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
  onEnterButtonClick = this.onEnterButtonClick.bind(this);

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

  /* getHeadingStyles() {
    return {
      // margin: '0 0 10px 0',
      margin: 0,
      fontSize: '13px',
      color: DARK_COLOR,
    };
  } */

  getCardStyles() {
    return {
      marginBottom: 20,
      padding: 5,
      border: '2px solid ' + DARK_COLOR,
      borderRadius: 3,
    };
  }

  getCardRowStyles() {
    return {
      display: 'flex',
      padding: 5,
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

  onEnterButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.enter();
  }

  render() {
    return <div style={this.getWrapperStyles()}>
      <div style={this.getContainerStyles()}>
        <div style={this.getCardStyles()}>
          {/* <div style={this.getCardRowStyles()}>
            <h1 style={this.getHeadingStyles()}>Quickload</h1>
          </div> */}
          <div style={this.getConnectorStyles()} />
          <div style={this.getCardRowStyles()}>
            <Avatar
              style={this.getAvatarStyles()}
              gender={this.props.user.gender}
              value={this.props.user.username}
              size={30}
              special
            />
            <div style={this.getCardRowTextStyles()}>{this.props.user.username}</div>
            <Button onClick={this.onChangeUserButtonClick} small>Change user</Button>
          </div>
          <div style={this.getCardRowStyles()}>
            <Identity
              style={this.getIdentityStyles()}
              value={this.props.world.worldname}
              size={30}
              special
            />
            <div style={this.getCardRowTextStyles()}>{this.props.world.worldname}</div>
            <Button onClick={this.onChangeWorldButtonClick} small>Choose world</Button>
          </div>
          <div style={this.getCardRowStyles()}>
            <Button onClick={this.onEnterButtonClick} primary small>Enter</Button>
          </div>
        </div>
      </div>
    </div>;
  }
}
