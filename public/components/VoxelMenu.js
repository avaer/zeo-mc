import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import {KEYS} from '../utils/input/index';
import {FRAME_RATE, MENU_TIME} from '../constants/index';

const MENU_LEFT_WIDTH = 400;
const MENU_RIGHT_WIDTH = 400;

const MENU_FG_DIM = 0.75;
const MENU_BG_DIM = 0.5;
const MENU_TRANSITION_FN = 'cubic-bezier(0,1,0,1)';

const {min, max} = Math;

export default class VoxelMenu extends React.Component {
  getStyles() {
    const {open} = this.props;

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      pointerEvents: open ? null : 'none'
    };
  }

  onKeyDown = e => {
    const {which} = e;

    if (which === KEYS.TAB) {
      const {engines} = this.props;
      const menuEngine = engines.getEngine('menu');
      menuEngine.toggleOpen();

      e.preventDefault();
    }
  };

  render() {
    const {open, lastOpenTime} = this.props;

    const menuProps = {
      open,
      lastOpenTime,
    };

    return <div style={this.getStyles()} tabIndex={-1} onKeyDown={this.onKeyDown}>
      <MenuBg {...menuProps} />
      <MenuFg {...menuProps} />
    </div>;
  }
};

class MenuBg extends React.Component {
  getStyles() {
    const {open} = this.props;

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, ' + MENU_BG_DIM + ')',
      opacity: open ? 1 : 0,
      transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
    };
  }

  render() {
    return <div style={this.getStyles()} />;
  }
}

class MenuFg extends React.Component {
  render() {
    const {open, lastOpenTime} = this.props;

    const menuProps = {
      open,
      lastOpenTime,
    };

    return <div>
      <Menu2d {...menuProps} />
      <Menu3d {...menuProps} />
    </div>;
  }
}

class Menu2d extends React.Component {
  render() {
    const {open} = this.props;

    const menu2dReactProps = {
      open,
    };

    const menu2dCanvasProps = {
      open,
    };

    return <div>
      <Menu2dReact {...menu2dReactProps} />
      <Menu2dCanvas {...menu2dCanvasProps} />
    </div>;
  }
}

class Menu2dReact extends React.Component {
  getLeftStyles() {
    const {open} = this.props;

    return {
      position: 'absolute',
      left: open ? 0 : -MENU_LEFT_WIDTH,
      top: 0,
      bottom: 0,
      width: MENU_LEFT_WIDTH,
      backgroundColor: 'rgba(255, 255, 255, ' + MENU_FG_DIM + ')',
      transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
    };
  }

  getRightStyles() {
    const {open} = this.props;

    return {
      position: 'absolute',
      right: open ? 0 : -MENU_RIGHT_WIDTH,
      top: 0,
      bottom: 0,
      width: MENU_RIGHT_WIDTH,
      backgroundColor: 'rgba(255, 255, 255, ' + MENU_FG_DIM + ')',
      transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
    };
  }

  render() {
    return <div>
      <div style={this.getLeftStyles()}>
        {/* XXX */}
      </div>
      <div style={this.getRightStyles()}>
        {/* XXX */}
      </div>
    </div>;
  }
}

class Menu2dCanvas extends React.Component {
  componentWillMount() {
    _ManualRefreshComponent.componentWillMount.call(this);

    this._canvas = null;
    this._ctx = null;
  }

  componentDidMount() {
    const {width, height} = this.props;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const domNode = this.domNode();
    domNode.appendChild(canvas);

    this._canvas = canvas;
    this._ctx = ctx;
  }

  componentWillUnmount() {
    _ManualRefreshComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshComponent.shouldComponentUpdate.call(this);
  }

  refresh() {
    console.log('menu 2d refresh');
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  } 

  render() {
    return <div />;
  }
}

class Menu3d extends React.Component {
  componentWillMount() {
    _ManualRefreshComponent.componentWillMount.call(this);
  }

  componentWillUnmount() {
    _ManualRefreshComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshComponent.shouldComponentUpdate.call(this);
  }

  refresh() {
    console.log('menu 3d refresh');
  }

  render() {
    return <div />;
  }
}


const _ManualRefreshComponent = {
  componentWillMount() {
    this._timeout = null;
    this._frame = null;

    _ManualRefreshComponent.listen.call(this);
  },

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    if (this._frame) {
      cancelAnimationFrame(this._frame);
    }
  },

  shouldComponentUpdate() {
    return false;
  },

  listen() {
    const recurse = () => {
      this._timeout = setTimeout(() => {
        this._timeout = null;

        this._frame = requestAnimationFrame(() => {
          this._frame = null;

          const {lastOpenTime} = this.props;
          const now = new Date();
          if ((+now - +lastOpenTime) < MENU_TIME) {
            this.refresh();
          }

          recurse();
        });
      }, FRAME_RATE);
    };

    recurse();
  }
};
