import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import {FRAME_RATE} from '../constants/index';

const MENU_LEFT_WIDTH = 300;
const MENU_RIGHT_WIDTH = 300;

export default class VoxelMenu extends React.Component {
  state = {
    state: null,
  };

  componentWillReceiveProps(nextProps) {
    const {visible} = nextProps;

    this.updateState(state => state
      .set('visible', visible));
  }

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    if (this._frame) {
      clearAnimationFrame(this._frame);
    }
  }

  updateState(fn) {
    const {state: oldState} = this.state;
    const newState = fn(oldState);
    this.setState('state', newState);
  }

  render() {
    const {visible} = this.props;

    const menu2dProps = {
      visible,
    };

    const menu3dProps = {
      visible,
    };

    return <div>
      <Menu2d {...menu2dProps} />
      <Menu3d {...menu3dProps} />
    </div>;
  }
};

class Menu2d extends React.Component {
  render() {
    const {visible} = this.props;

    const menu2dReactProps = {
      visible,
    };

    const menu2dCanvasProps = {
      visible,
    };

    return <div>
      <Menu2dReact {...menu2dReactProps} />
      <Menu2dCanvas {...menu2dCanvasProps} />
    </div>;
  }
}

class Menu2dReact extends React.Component {
  getStyles() {
    const {visible} = this.props;

    return {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.1s cubic-bezier(0,0,1,1)',
    };
  }

  getLeftStyles() {
    const {visible} = this.props;

    return {
      position: 'relative',
      left: visible ? 0 : -MENU_LEFT_WIDTH,
      transition: 'all 0.1s cubic-bezier(0,0,1,1)',
    };
  }

  getRightStyles() {
    const {visible} = this.props;

    return {
      position: 'relative',
      right: visible ? 0 : -MENU_RIGHT_WIDTH,
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

          const {visible} = this.props;
          if (visible) {
            this.refresh();
          }

          recurse();
        });
      }, FRAME_RATE);
    };

    recurse();
  }
};
