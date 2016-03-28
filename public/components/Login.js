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
  onFormSubmit = this.onFormSubmit.bind(this);
  onStartCreateAccountButtonClick = this.onStartCreateAccountButtonClick.bind(this);
  onCancelButtonClick = this.onCancelButtonClick.bind(this);
  onCreateAccountButtonClick = this.onCreateAccountButtonClick.bind(this);

  state = {
    username: '',
    password: '',
    gender: 'male',
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
    };
  }

  getHeadingStyles() {
    return {
      margin: '0 0 40px 0',
      color: DARK_COLOR,
    };
  }

  getAvatarStyles() {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  getLabelStyles() {
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
  }

  getRadioLabelsStyles() {
    return {
      display: 'flex',
      paddingTop: 10,
    };
  }

  getRadioLabelStyles() {
    return {
      display: 'flex',
      marginRight: 20,
      cursor: 'pointer',
    };
  }

  getRadioInputStyles() {
    return {
      display: 'block',
      WebkitAppearance: 'none',
      width: 12,
      height: 12,
      margin: '0 10px 0 0',
      backgroundColor: 'white',
      border: '2px solid ' + DARK_COLOR,
      outline: 'none',
      boxSizing: 'border-box',
    };
  }

  getRadioInputCheckboxStyles({checked}) {
    return {
      position: 'absolute',
      marginTop: 3,
      marginLeft: 3,
      height: 6,
      width: 6,
      backgroundColor: '#4cd964',
      visibility: checked ? null : 'hidden',
    };
  }

  getRadioLabelTextStyles() {
    return {
      fontSize: '13px',
      WebkitUserSelect: 'none',
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

  onGenderChange(gender) {
    return () => {
      this.setState({
        gender
      });
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

  onLoginButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    const {username, password} = this.state;
    loginEngine.loginWithUsernamePassword({username, password});
  }

  onFormSubmit(e) {
    if (!this.props.creatingAccount) {
      this.onLoginButtonClick();
    } else {
      this.onCreateAccountButtonClick();
    }

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

  onCancelButtonClick() {
    this.setState({
      username: '',
      password: '',
    });

    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.back();
    loginEngine.clearError();

    this.selectUsernameInput();
  }

  onCreateAccountButtonClick(e) {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    const {username, password, gender} = this.state;
    loginEngine.createAccount({username, password, gender});
    loginEngine.clearError();

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    return <div style={this.getWrapperStyles()}>
      <form style={this.getContainerStyles()} onSubmit={this.onFormSubmit}>
        {!this.props.creatingAccount ? <h1 style={this.getHeadingStyles()}>Sign in</h1> : null}
        {this.props.creatingAccount ? <h1 style={this.getHeadingStyles()}>New account</h1> : null}
        {this.props.creatingAccount ? <Avatar
          style={this.getAvatarStyles()}
          gender={this.state.gender}
          value={this.state.username || (this.state.gender === 'male' ? 'avaert' : 'u')}
          size={50}
          special
        /> : null}
        {this.props.creatingAccount ? <div style={this.getLabelStyles()}>
          <div style={this.getLabelTextStyles({focused: true})}>Gender</div>
          <div style={this.getRadioLabelsStyles()}>
            <label style={this.getRadioLabelStyles()}>
              <div style={this.getRadioInputCheckboxStyles({checked: this.state.gender === 'male'})} />
              <input
                type='radio'
                name='gender'
                style={this.getRadioInputStyles()}
                checked={this.state.gender === 'male'}
                onChange={this.onGenderChange('male')}
              />
              <span style={this.getRadioLabelTextStyles()}>Male</span>
            </label>
            <label style={this.getRadioLabelStyles()}>
              <div style={this.getRadioInputCheckboxStyles({checked: this.state.gender === 'female'})} />
              <input
                type='radio'
                name='gender'
                style={this.getRadioInputStyles()}
                checked={this.state.gender === 'female'}
                onChange={this.onGenderChange('female')}
              />
              <span style={this.getRadioLabelTextStyles()}>Female</span>
            </label>
          </div>
        </div> : null}
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
          <Button onClick={this.onCancelButtonClick}>Cancel</Button>
        </div> : null}
        <div style={this.getErrorStyles()}>{'> ' + (this.props.error || null)}</div>
      </form>
    </div>;
  }
}
