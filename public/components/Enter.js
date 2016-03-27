import React from 'react';

import Button from './Button';

const LOGIN_FONT = '\'Press Start 2P\', cursive';
const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Enter extends React.Component {
  componentDidMount(nextProps) {
    this.selectUsernameInput();
  }

  componentWillUpdate(nextProps) {
    const {props: prevProps} = this;
    if (nextProps.error && !prevProps.error) {
      this.selectUsernameInput();
    }
  }

  selectUsernameInput() {
    const {username: usernameInput} = this.refs;
    setTimeout(() => {
      usernameInput.focus();
      usernameInput.select();
    });
  }

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
      // height: 200,
    };
  }

  getHeadingStyles() {
    return {
      margin: '0 0 40px 0',
      color: DARK_COLOR,
    };
  }

  getLabelTextStyles() {
    return {
      marginBottom: 10,
    };
  }

  getUsernameLabelStyles() {
    const {usernameInputFocused} = this.state;
    return {
      display: 'block',
      paddingBottom: 30,
      color: !usernameInputFocused ? LIGHT_COLOR : DARK_COLOR,
      fontSize: '13px',
      cursor: 'text',
    };
  }

  getPasswordLabelStyles() {
    const {passwordInputFocused} = this.state;
    return {
      display: 'block',
      paddingBottom: 30,
      color: !passwordInputFocused ? LIGHT_COLOR : DARK_COLOR,
      fontSize: '13px',
      cursor: 'text',
    };
  }

  getUsernameInputStyles() {
    const {usernameInputFocused} = this.state;
    return {
      display: 'block',
      height: 30,
      width: '100%',
      border: 0,
      borderBottom: '2px solid ' + (!usernameInputFocused ? LIGHT_COLOR : DARK_COLOR),
      fontFamily: LOGIN_FONT,
      fontSize: '13px',
      textAlign: 'center',
      outline: 'none',
    };
  }

  getPasswordInputStyles() {
    const {passwordInputFocused} = this.state;
    return {
      display: 'block',
      width: '100%',
      border: 0,
      borderBottom: '2px solid ' + (!passwordInputFocused ? LIGHT_COLOR : DARK_COLOR),
      fontFamily: LOGIN_FONT,
      fontSize: '13px',
      lineHeight: '30px',
      textAlign: 'center',
      outline: 'none',
    };
  }

  getErrorStyles() {
    const {error} = this.props;
    return {
      padding: 10,
      backgroundColor: '#ff9500',
      fontSize: '12px',
      color: 'white',
      visibility: error ? null : 'hidden',
    };
  }

  onUsernameChange(e) {
    const username = e.target.value;
    this.setState({
      username
    });

    this.clearError();
  }

  onPasswordChange(e) {
    const password = e.target.value;
    this.setState({
      password
    });

    this.clearError();
  }

  clearError() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.clearError();
  }

  onUsernameInputFocus() {
    this.setState({
      usernameInputFocused: true
    });
  }

  onUsernameInputBlur() {
    this.setState({
      usernameInputFocused: false
    });
  }

  onPasswordInputFocus() {
    this.setState({
      passwordInputFocused: true
    });
  }

  onPasswordInputBlur() {
    this.setState({
      passwordInputFocused: false
    });
  }

  onSubmitButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    const {username, password} = this.state;
    loginEngine.loginWithUsernamePassword({username, password});
  }

  render() {
console.log('enter props', this.props);

    return <div style={this.getWrapperStyles()}>
      <div style={this.getContainerStyles()}>
        <h1 style={this.getHeadingStyles()}>Choose world</h1>
        <Worlds worlds={this.props.worlds} />
        <Button onClick={this.onSubmitButtonClick}>Create world</Button>
        <div style={this.getErrorStyles()}>{'> ' + (this.props.error || null)}</div>
      </div>
    </div>;
  }
}

class Worlds extends React.Component {
  getWorldsStyles() {
    return {
      marginBottom: 20,
      border: '2px solid ' + DARK_COLOR,
      borderRadius: 3,
      padding: 10,
      width: '100%',
      height: 300,
    };
  }

  render() {
    const {worlds} = this.props;

    return <div style={this.getWorldsStyles()}>
      {worlds.size === 0 ?
        <World key={null}/>
      :
        worlds.map(world => <World world={world} key={world.worldname} />)
      }
    </div>;
  }
}

class World extends React.Component {
  getStyles() {
    const {world} = this.props;

    return {
      display: 'flex',
      color: world ? DARK_COLOR : LIGHT_COLOR,
    };
  }

  getIconStyles() {
    const {world} = this.props;

    return {
      display: world ? null : 'none',
      width: 30,
      height: 30,
      marginRight: 10,
      border: '2px solid ' + DARK_COLOR,
    };
  }

  getTextStyles() {
    return {
      fontSize: '13px',
    };
  }

  render() {
    const {world} = this.props;
    
    return <div style={this.getStyles()}>
      <div style={this.getIconStyles()} />
      <div style={this.getTextStyles()}>{world ? world.name : '<no worlds>'}</div>
    </div>
  }
}
