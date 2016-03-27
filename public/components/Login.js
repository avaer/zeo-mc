import React from 'react';
import ReactDOM from 'react-dom';

import Label from './Label';
import Input from './Input';
import Button from './Button';
import Avatar from './Avatar';

const LOGIN_FONT = '\'Press Start 2P\', cursive';
const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Login extends React.Component {
  setUsernameInput = this.setUsernameInput.bind(this);
  setPasswordInput = this.setPasswordInput.bind(this);
  onUsernameChange = this.onUsernameChange.bind(this);
  onPasswordChange = this.onPasswordChange.bind(this);
  onLoginButtonClick = this.onLoginButtonClick.bind(this);
  onStartCreateAccountButtonClick = this.onStartCreateAccountButtonClick.bind(this);
  onEndCreateAccountButtonClick = this.onEndCreateAccountButtonClick.bind(this);

  state = {
    username: '',
    password: '',
    usernameInputFocused: false,
    passwordInputFocused: false,
  };
  usernameInput = null;
  passwordInput = null;

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
    setTimeout(() => {
      const usernameInput = ReactDOM.findDOMNode(this.usernameInput);
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

  getLabelStyles() {
    return {
      display: 'block',
      paddingBottom: 30,
    };
  }

  getLabelTextStyles({focused}) {
    console.log('label text styles', {focused});
    return {
      marginBottom: 10,
      color: !focused ? LIGHT_COLOR : DARK_COLOR,
      fontSize: '13px',
      cursor: 'text',
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

  setUsernameInput(usernameInput) {
    this.usernameInput = usernameInput;
  }

  setPasswordInput(passwordInput) {
    this.passwordInput = passwordInput;
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
        <Label style={this.getLabelStyles()}>
          {({focused, onFocus, onBlur}) => <div>
            <div style={this.getLabelTextStyles({focused})} key='label'>Username</div>
            <Input
              value={this.state.username}
              focused={focused}
              ref={this.setUsernameInput}
              onChange={this.onUsernameChange}
              onFocus={onFocus}
              onBlur={onBlur}
              key='input'
            />
          </div>}
        </Label>
        <Label style={this.getLabelStyles()}>
          {({focused, onFocus, onBlur}) => <div>
            <div style={this.getLabelTextStyles({focused})} key='label'>Password</div>
            <Input
              value={this.state.password}
              focused={focused}
              ref={this.setPasswordInput}
              onChange={this.onPasswordChange}
              onFocus={onFocus}
              onBlur={onBlur}
              key='input'
            />
          </div>}
        </Label>
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
