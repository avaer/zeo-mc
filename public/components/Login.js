import React from 'react';

import Button from './Button';
import Avatar from './Avatar';

const LOGIN_FONT = '\'Press Start 2P\', cursive';
const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Login extends React.Component {
  onUsernameChange = this.onUsernameChange.bind(this);
  onPasswordChange = this.onPasswordChange.bind(this);
  onUsernameInputFocus = this.onUsernameInputFocus.bind(this);
  onUsernameInputBlur = this.onUsernameInputBlur.bind(this);
  onPasswordInputFocus = this.onPasswordInputFocus.bind(this);
  onPasswordInputBlur = this.onPasswordInputBlur.bind(this);
  onLoginButtonClick = this.onLoginButtonClick.bind(this);
  onStartCreateAccountButtonClick = this.onStartCreateAccountButtonClick.bind(this);
  onEndCreateAccountButtonClick = this.onEndCreateAccountButtonClick.bind(this);

  state = {
    username: '',
    password: '',
    usernameInputFocused: false,
    passwordInputFocused: false,
    loginButtonHovered: false,
    loginButtonFocused: false,
    loginButtonActive: false,
    createButtonHovered: false,
    createButtonFocused: false,
    createButtonActive: false,
  };

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
    };
  }

  getAvatarStyles() {
    return {
      position: 'absolute',
      width: 34,
      height: 34,
      marginTop: 15,
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
      height: 32,
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
      height: 32,
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

  getButtonsStyles() {
    return {
      display: 'flex',
      marginBottom: 20,
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

  onLoginButtonClick(e) {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    const {username, password} = this.state;
    loginEngine.loginWithUsernamePassword({username, password});

    e.preventDefault();
    e.stopPropagation();
  }

  onStartCreateAccountButtonClick() {
    this.setState({
      username: '',
      password: '',
    });

    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.startCreateAccount();
    loginEngine.clearError();

    this.selectUsernameInput();
  }

  onEndCreateAccountButtonClick() {
    this.setState({
      username: '',
      password: '',
    });

    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.endCreateAccount();
    loginEngine.clearError();

    this.selectUsernameInput();
  }

  render() {
    return <div style={this.getWrapperStyles()}>
      <form style={this.getContainerStyles()} onSubmit={this.onLoginButtonClick}>
        {!this.props.creatingAccount ? <h1 style={this.getHeadingStyles()}>Sign in</h1> : null}
        {this.props.creatingAccount ? <h1 style={this.getHeadingStyles()}>New account</h1> : null}
        {this.props.creatingAccount ? <Avatar
          type='user'
          style={this.getAvatarStyles()}
          gender='female'
          value={this.state.username}
          special
        /> : null}
        <label style={this.getUsernameLabelStyles()}>
          <div style={this.getLabelTextStyles()}>Username</div>
          <input
            type='text'
            style={this.getUsernameInputStyles()}
            value={this.state.username}
            ref='username'
            onChange={this.onUsernameChange}
            onFocus={this.onUsernameInputFocus}
            onBlur={this.onUsernameInputBlur}
          />
        </label>
        <label style={this.getPasswordLabelStyles()}>
          <div style={this.getLabelTextStyles()}>Password</div>
          <input
            type='password'
            style={this.getPasswordInputStyles()}
            value={this.state.password}
            ref='password'
            onChange={this.onPasswordChange}
            onFocus={this.onPasswordInputFocus}
            onBlur={this.onPasswordInputBlur}
          />
        </label>
        {!this.props.creatingAccount ? <div style={this.getButtonsStyles()}>
          <Button onClick={this.onLoginButtonClick} submit>Login</Button>
          <Button onClick={this.onStartCreateAccountButtonClick}>Create Account</Button>
        </div> : null}
        {this.props.creatingAccount ? <div style={this.getButtonsStyles()}>
          <Button onClick={this.onCreateAccountButtonClick} submit>Create Account</Button>
          <Button onClick={this.onEndCreateAccountButtonClick}>Cancel</Button>
        </div> : null}
        <div style={this.getErrorStyles()}>{'> ' + (this.props.error || null)}</div>
      </form>
    </div>;
  }
}
