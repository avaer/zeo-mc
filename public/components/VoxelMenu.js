import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import {FRAME_RATE, MENU_TIME} from '../constants/index';

const MENU_LEFT_WIDTH = 300;
const MENU_RIGHT_WIDTH = 300;

const MENU_DIM = 0.75;

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

  render() {
    const {open, lastOpenTime} = this.props;

    const menuProps = {
      open,
      lastOpenTime,
    };

    return <div style={this.getStyles()}>
      <MenuBg {...menuProps} />
      <MenuFg {...menuProps} />
    </div>;
  }
};

class MenuBg extends React.Component {
  getStyles() {
    const {open, lastOpenTime} = this.props;

    const opacity = (() => {
      const now = new Date();
      const timeDiff = (+now - +lastOpenTime) / 1000;
      const timeFactor = timeDiff / MENU_TIME;

      if (open) {
        return min(timeFactor, 1);
      } else {
        return max(1 - timeFactor, 0); 
      }
    })();

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, ' + MENU_DIM + ')',
      opacity,
      transition: 'all 0.1s cubic-bezier(0,0,1,1)',
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
  getStyles() {
    const {open} = this.props;

    return {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      transition: 'all 0.1s cubic-bezier(0,0,1,1)',
    };
  }

  getLeftStyles() {
    const {open} = this.props;

    return {
      position: 'relative',
      left: open ? 0 : -MENU_LEFT_WIDTH,
      transition: 'all 0.1s cubic-bezier(0,0,1,1)',
    };
  }

  getRightStyles() {
    const {open} = this.props;

    return {
      position: 'relative',
      right: open ? 0 : -MENU_RIGHT_WIDTH,
      transition: 'all 0.1s cubic-bezier(0,0,1,1)',
    };
  }

  render() {
    return <div style={this.getStyles()}>
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
      clearAnimationFrame(this._frame);
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
