import React from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

import {GRADIENTS} from '../resources/index';
import {KEYS} from '../utils/input/index';
import {FRAME_RATE, MENU_TIME} from '../constants/index';

const MENU_LEFT_WIDTH = 400;
const MENU_RIGHT_WIDTH = 400;

const MENU_FG_DIM = 0.6;
const MENU_BG_DIM = 0.5;
const MENU_TRANSITION_FN = 'cubic-bezier(0,1,0,1)';

const CUBE_SIZE = 0.7;
const CUBE_ROTATION_RATE = 5000;

const {min, max, floor, random} = Math;

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
    return <div style={this.getStyles()} tabIndex={-1} onKeyDown={this.onKeyDown}>
      <MenuBg {...this.props} />
      <MenuFg {...this.props} />
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
    return <div>
      <Menu2d {...this.props} />
      <Menu3d {...this.props} />
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
    return _getLeftStyles({open});
  }

  getRightStyles() {
    const {open} = this.props;
    return _getRightStyles({open});
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
    // XXX
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  } 

  render() {
    return <div />;
  }
}

class Menu3d extends React.Component {
  getLeftStyles() {
    const {open} = this.props;
    return _getLeftStyles({open});
  }

  getRightStyles() {
    const {open} = this.props;
    return _getRightStyles({open});
  }

  render() {
    return <div>
      <div style={this.getLeftStyles()}>
        <Menu3dLeft {...this.props} />
      </div>
      <div style={this.getRightStyles()}>
        <Menu3dRight {...this.props} />
      </div>
    </div>;
  }
}

class Menu3dLeft extends React.Component {
  componentWillMount() {
    _ManualRefreshComponent.componentWillMount.call(this);
  }

  componentWillUnmount() {
    _ManualRefreshComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshComponent.shouldComponentUpdate.call(this);
  }

  componentDidMount() {
    const width = MENU_LEFT_WIDTH;
    const height = MENU_LEFT_WIDTH;
    const {devicePixelRatio} = this.props;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width * devicePixelRatio, height * devicePixelRatio);
    const canvas = renderer.domElement;
    canvas.style.width = width;
    canvas.style.height = height;

    const scene = new THREE.Scene();
    const cubes = (() => {
      const result = [];
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          const mesh = (() => {
            if (random() < 0.5) {
              const gradient = GRADIENTS[floor(random() * GRADIENTS.length)];
              const geometry = _makeCubeGeometry(gradient);
              const mesh = (() => {
                if (random() < 0.5) {
                  const material = CUBE_EMPTY_MATERIAL;
                  const mesh = new THREE.Mesh(geometry, material);
                  return mesh;
                } else {
                  const materials = CUBE_FULL_MATERIALS;
                  const mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
                  return mesh;
                }
              })();
              mesh.position.set(-3 + x * 2, -3 + y * 2, 0);
              mesh.rotation.order = 'XYZ';
              return mesh;
            } else {
              return null;
            }
          })();
          if (mesh) {
            result.push(mesh);
          }
        }
      }
      return result;
    })();
    cubes.forEach(cube => {
      scene.add(cube);
    });

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 1000);
    camera.position.set(0, 0, 12);

    const domNode = this.domNode();
    domNode.appendChild(canvas);

    this._menu = {renderer, scene, camera, cubes};
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  refresh() {
    const {renderer, scene, camera, cubes} = this._menu;

    const time = new Date();
    const timeFactor = (+time % CUBE_ROTATION_RATE) / CUBE_ROTATION_RATE;
    const rotationFactor = timeFactor * Math.PI * 2;
    cubes.forEach((cube, i) => {
      const localRotationFactor = rotationFactor + (((i % 4) / 4) * Math.PI * 2);
      cube.rotation.set(0, localRotationFactor, localRotationFactor);
    });

    renderer.render(scene, camera);
  }

  render() {
    return <div />;
  }
}

class Menu3dRight extends React.Component {
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

          const {open} = this.props;
          if (open) {
            this.refresh();
          } else {
            const {lastOpenTime} = this.props;
            const now = new Date();
            if (((+now - +lastOpenTime) / 1000) < MENU_TIME) {
              this.refresh();
            }
          }

          recurse();
        });
      }, 1000 / FRAME_RATE);
    };

    recurse();
  }
};

function _getLeftStyles({open}) {
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

function _getRightStyles({open}) {
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

function _makeCubeGeometry(gradient) {
  const {colors} = gradient;

  const cubeGeometry = new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const {faces, vertices} = cubeGeometry;

  function getVertexColor(v) {
    if (v.x < 0) {
      return new THREE.Color(colors[0]);
    } else {
      return new THREE.Color(colors[1]);
    }
  }

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    face.vertexColors[0] = getVertexColor(vertices[face.a]);
    face.vertexColors[1] = getVertexColor(vertices[face.b]);
    face.vertexColors[2] = getVertexColor(vertices[face.c]);
  }

  const bufferGeometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry);
  return bufferGeometry;
}

const CUBE_EMPTY_MATERIAL = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0.15,
  wireframe: true,
});

const CUBE_FULL_MATERIALS = [
  new THREE.MeshBasicMaterial({
    // shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
    opacity: 0.96,
    transparent: true
  }),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.75,
    wireframe: true,
    wireframeLinewidth: 2,
    // transparent: true
  }),
];
