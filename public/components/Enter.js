import React from 'react';
import ReactDOM from 'react-dom';

import Label from './Label';
import Input from './Input';
import Button from './Button';
import Identity from './Identity';

const DARK_COLOR = '#333';
const LIGHT_COLOR = '#CCC';

export default class Enter extends React.Component {
  setWorldnameInput = this.setWorldnameInput.bind(this);
  setSeedInput = this.setSeedInput.bind(this);
  onWorldnameChange = this.onWorldnameChange.bind(this);
  onSeedChange = this.onSeedChange.bind(this);
  onFormSubmit = this.onFormSubmit.bind(this);
  onStartCreateWorldButtonClick = this.onStartCreateWorldButtonClick.bind(this);
  onCancelButtonClick = this.onCancelButtonClick.bind(this);
  onBackButtonClick = this.onBackButtonClick.bind(this);
  onCreateWorldButtonClick = this.onCreateWorldButtonClick.bind(this);
  onWorldEnter = this.onWorldEnter.bind(this);
  onWorldDelete = this.onWorldDelete.bind(this);

  state = {
    worldName: '',
    seed: '',
  };
  worldnameInput = null;
  seedInput = null;

  componentDidMount() {
    this.selectWorldnameInput();
  }

  componentWillUpdate(nextProps) {
    const {props: prevProps} = this;
    if (
      (nextProps.creatingWorld && !prevProps.creatingWorld) ||
      (nextProps.error && !prevProps.error)
    ) {
      this.selectWorldnameInput();
    }
  }

  selectWorldnameInput() {
    setTimeout(() => {
      const worldnameInput = ReactDOM.findDOMNode(this.worldnameInput);
      worldnameInput.focus();
      worldnameInput.select();
    });
  }

  setWorldnameInput(worldnameInput) {
    this.worldnameInput = worldnameInput;
  }

  setSeedInput(seedInput) {
    this.seedInput = seedInput;
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

  getCreateWorldFormStyles() {
    const {creatingWorld} = this.props;
    return {
      display: creatingWorld ? null : 'none',
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

  getButtonsStyles() {
    return {
      display: 'flex',
      marginBottom: 20,
    };
  }

  getIdentityStyles() {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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

  /* onUsernameChange(e) {
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
  } */

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

  onCancelButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.back();
  }

  onBackButtonClick() {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.back();
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

  onWorldEnter(worldname) {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.selectWorld(worldname);
  }

  onWorldDelete(worldname) {
    const {engines} = this.props;
    const loginEngine = engines.getEngine('login');
    loginEngine.deleteWorld(worldname);
  }

  render() {
    return <div style={this.getWrapperStyles()}>
      <form style={this.getContainerStyles()} onSubmit={this.onFormSubmit}>
        {!this.props.creatingWorld ? <h1 style={this.getHeadingStyles()}>Choose world</h1> : null}
        {this.props.creatingWorld ? <h1 style={this.getHeadingStyles()}>New world</h1> : null}
        {!this.props.creatingWorld ? <Worlds
          worlds={this.props.worlds}
          onWorldEnter={this.onWorldEnter}
          onWorldDelete={this.onWorldDelete}
        /> : null}
        <div style={this.getCreateWorldFormStyles()}>
          <Identity
            style={this.getIdentityStyles()}
            size={50}
            value={this.state.worldname || 'world'}
            special
          />
          <Label style={this.getLabelStyles()}>
            {({focused, onFocus, onBlur}) => <div>
              <div style={this.getLabelTextStyles({focused})} key='label'>World name</div>
              <Input
                value={this.state.worldname}
                focused={focused}
                ref={this.setWorldnameInput}
                onChange={this.onWorldnameChange}
                onFocus={onFocus}
                onBlur={onBlur}
                key='input'
              />
            </div>}
          </Label>
          <Label style={this.getLabelStyles()}>
            {({focused, onFocus, onBlur}) => <div>
              <div style={this.getLabelTextStyles({focused})} key='label'>Seed</div>
              <Input
                value={this.state.seed}
                focused={focused}
                ref={this.setSeedInput}
                onChange={this.onSeedChange}
                onFocus={onFocus}
                onBlur={onBlur}
                key='input'
              />
            </div>}
          </Label>
        </div>
        {!this.props.creatingWorld ? <div style={this.getButtonsStyles()}>
          <Button onClick={this.onStartCreateWorldButtonClick} submit>Create world</Button>
          <Button onClick={this.onBackButtonClick}>Back</Button>
        </div> : null}
        {this.props.creatingWorld ? <div style={this.getButtonsStyles()}>
          <Button onClick={this.onCreateWorldButtonClick} submit>Create</Button>
          <Button onClick={this.onCancelButtonClick}>Cancel</Button>
        </div> : null}
        <div style={this.getErrorStyles()}>{'> ' + (this.props.error || null)}</div>
      </form>
    </div>;
  }
}

class Worlds extends React.Component {
  getWorldsStyles() {
    return {
      marginBottom: 20,
      border: '2px solid ' + DARK_COLOR,
      borderRadius: 3,
      padding: 5,
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
        worlds.map(world => <World
          world={world}
          onEnter={this.props.onWorldEnter}
          onDelete={this.props.onWorldDelete}
          key={world.worldname}
        />)
      }
    </div>;
  }
}

class World extends React.Component {
  onClick = this.onClick.bind(this);
  onMouseOver = this.onMouseOver.bind(this);
  onMouseOut = this.onMouseOut.bind(this);
  onDeleteButtonClick = this.onDeleteButtonClick.bind(this);

  state = {
    hovered: false,
  };

  getStyles() {
    const {world} = this.props;
    const {hovered} = this.state;

    return {
      display: 'flex',
      padding: 5,
      color: world ? DARK_COLOR : LIGHT_COLOR,
      backgroundColor: (world && hovered) ? '#EEE' : 'transparent',
      cursor: world ? 'pointer' : null,
    };
  }

  getIdentityStyles() {
    const {world} = this.props;

    return {
      display: world ? 'block' : 'none',
      width: 30,
      height: 30,
      marginRight: 10,
      border: '2px solid ' + DARK_COLOR,
    };
  } 

  getTextStyles() {
    return {
      fontSize: '13px',
      lineHeight: '34px',
      flex: 1,
    };
  }

  getDeleteButtonStyles() {
    const {world} = this.props;
    return {
      display: world ? null : 'none',
      margin: '3px 0',
    };
  }

  onClick() {
    const {world, onEnter} = this.props;
    if (world) {
      const {worldname} = world;
      onEnter(worldname);
    }
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

  onDeleteButtonClick(e) {
    const {world, onDelete} = this.props;
    const {worldname} = world;
    onDelete(worldname);

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {world} = this.props;
    
    return <div style={this.getStyles()} onClick={this.onClick} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
      <Identity
        style={this.getIdentityStyles()}
        size={30}
        value={world ? world.worldname : null}
        special
      />
      <div style={this.getTextStyles()}>{world ? world.worldname : '<no worlds>'}</div>
      <Button
        style={this.getDeleteButtonStyles()}
        onClick={this.onDeleteButtonClick}
        small
      >delete</Button>
    </div>
  }
}
