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

  /* getLabelStyles() {
    return {
      display: 'block',
      paddingBottom: 20,
      cursor: 'text',
    };
  }

  getLabelTextStyles({focused}) {
    return {
      marginBottom: 10,
      color: !focused ? LIGHT_COLOR : DARK_COLOR,
      fontSize: '13px',
      WebkitUserSelect: 'none',
    };
  } */

  getButtonsStyles() {
    return {
      display: 'flex',
      marginBottom: 20,
    };
  }

  /* getErrorStyles() {
    const {error} = this.props;
    return {
      padding: 10,
      backgroundColor: '#ff9500',
      fontSize: '12px',
      color: 'white',
      visibility: error ? null : 'hidden',
    };
  }

  onWorldnameChange(e) {
    const worldname = e.target.value;
    this.setState({
      worldname
    });

    this.clearError();
  }

  onSeedChange(e) {
    const seed = e.target.value;
    this.setState({
      seed
    });

    this.clearError();
  }

  clearError() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.clearError();
  }

  onFormSubmit(e) {
    if (!this.props.creatingWorld) {
      this.onStartCreateWorldButtonClick();
    } else {
      this.onCreateWorldButtonClick();
    }

    e.preventDefault();
    e.stopPropagation();
  }

  onStartCreateWorldButtonClick() {
    this.setState({
      worldname: '',
      seed: '',
    });

    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.startCreateWorld();
  }

  onEndCreateWorldButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.endCreateWorld();
  }

  onCreateWorldButtonClick(e) {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    const {worldname, seed} = this.state;
    loginEngine.createWorld({worldname, seed});

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  onWorldDelete(worldname) {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.deleteWorld(worldname);
  } */

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
            <Button onClick={this.onChooseWorldButtonClick} small>Choose world</Button>
          </div>
          <div style={this.getCardRowStyles()}>
            <Button onClick={this.onEnterButtonClick} primary small>Enter</Button>
          </div>
        </div>
      </div>
    </div>;
  }
}
