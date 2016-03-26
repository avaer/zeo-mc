import React from 'react';

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
  onSubmitButtonMouseOver = this.onSubmitButtonMouseOver.bind(this);
  onSubmitButtonMouseOut = this.onSubmitButtonMouseOut.bind(this);
  onSubmitButtonFocus = this.onSubmitButtonFocus.bind(this);
  onSubmitButtonBlur = this.onSubmitButtonBlur.bind(this);
  onSubmitButtonMouseDown = this.onSubmitButtonMouseDown.bind(this);
  onSubmitButtonMouseUp = this.onSubmitButtonMouseUp.bind(this);
  onSubmitButtonClick = this.onSubmitButtonClick.bind(this);

  state = {
    username: '',
    password: '',
    usernameInputFocused: false,
    passwordInputFocused: false,
    submitButtonHovered: false,
    submitButtonFocused: false,
    submitButtonActive: false,
  };

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

  getSubmitButtonStyles() {
    const {submitButtonHovered, submitButtonFocused, submitButtonActive} = this.state;
    const submitButtonSpecial = submitButtonHovered || submitButtonFocused;

    return {
      padding: 13,
      border: '2px solid ' + (!submitButtonSpecial ? DARK_COLOR : 'transparent'),
      backgroundColor: !submitButtonSpecial ? 'transparent' : !submitButtonActive ? '#ff2d55' : '#c70024',
      fontFamily: LOGIN_FONT,
      color: !submitButtonSpecial ? DARK_COLOR : 'white',
      fontSize: '13px',
      lineHeight: 1,
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.1s ease-out',
    };
  }

  onUsernameChange(e) {
    const username = e.target.value;
    this.setState({
      username
    });
  }

  onPasswordChange(e) {
    const password = e.target.value;
    this.setState({
      password
    });
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

  onSubmitButtonMouseOver() {
    this.setState({
      submitButtonHovered: true
    });
  }

  onSubmitButtonMouseOut() {
    this.setState({
      submitButtonHovered: false
    });
  }

  onSubmitButtonFocus() {
    this.setState({
      submitButtonFocused: true
    });
  }

  onSubmitButtonBlur() {
    this.setState({
      submitButtonFocused: false
    });
  }

  onSubmitButtonMouseDown() {
    this.setState({
      submitButtonActive: true
    });
  }

  onSubmitButtonMouseUp() {
    this.setState({
      submitButtonActive: false
    });
  }

  onSubmitButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    const {username, password} = this.state;
    loginEngine.loginWithUsernamePassword({username, password});
  }

  render() {
    return <div style={this.getWrapperStyles()}>
      <div style={this.getContainerStyles()}>
        <h1 style={this.getHeadingStyles()}>Sign in</h1>
        <label style={this.getUsernameLabelStyles()}>
          <div style={this.getLabelTextStyles()}>Username</div>
          <input
            type='text'
            style={this.getUsernameInputStyles()}
            value={this.state.username}
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
            onChange={this.onPasswordChange}
            onFocus={this.onPasswordInputFocus}
            onBlur={this.onPasswordInputBlur}
          />
        </label>
        <button
          style={this.getSubmitButtonStyles()}
          onMouseOver={this.onSubmitButtonMouseOver}
          onMouseOut={this.onSubmitButtonMouseOut}
          onFocus={this.onSubmitButtonFocus}
          onBlur={this.onSubmitButtonBlur}
          onMouseDown={this.onSubmitButtonMouseDown}
          onMouseUp={this.onSubmitButtonMouseUp}
          onClick={this.onSubmitButtonClick}
        >Login</button>
      </div>
    </div>;
  }
}
