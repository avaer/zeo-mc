import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import THREE from 'three';
import murmur from 'murmurhash-js';

import {BLOCKS, GRADIENTS} from '../resources/index';
import {KEYS} from '../utils/input/index';
import {FRAME_RATE, MENU_TIME} from '../constants/index';

const MENU_WIDTH = 300;
const MENU_CANVAS_WIDTH = 250;
const MENU_CANVAS_PIXELATION = 1.5;
const MENU_BAR_WIDTH = 256;
const MENU_BORDER_COLOR = '#333';

const MENU_FONT = '\'Press Start 2P\', cursive';
const MENU_FG_DIM = 0.75;
const MENU_BG_DIM = 0.5;
const MENU_TRANSITION_FN = 'cubic-bezier(0,1,0,1)';

const MENU_TABS = [
  {name: 'all', icon: 'search', value: '\uf002'},
  {name: 'block', icon: 'cube', value: '\uf1b2'},
  {name: 'item', icon: 'flask', value: '\uf0c3'},
  {name: 'structure', icon: 'industry', value: '\uf275'},
  {name: 'weapon', icon: 'bomb', value: '\uf1e2'},
  {name: 'materia', icon: 'level-up', value: '\uf219'},
];

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
      fontFamily: MENU_FONT,
      color: '#444',
      pointerEvents: 'none'
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
    const {tab, inventory, itemIndex, dragItemIndex} = this.props;
    const filteredInventory = (() => {
      if (tab === 'all') {
        return inventory.slice(0, 16);
      } else {
        return inventory.filter(item => {
          const {type} = item;
          return type === tab;
        }).slice(0, 16);
      }
    })();
    const item = (() => {
      if (itemIndex !== null) {
        const item = filteredInventory.get(itemIndex);
        return item;
      } else {
        return null;
      }
    })();
    const dragItem = (() => {
      if (dragItemIndex !== null) {
        const item = filteredInventory.get(dragItemIndex);
        return item;
      } else {
        return null;
      }
    })();

    const props = {
      ...this.props,
      filteredInventory,
      item,
      dragItem,
    };

    return <div style={this.getStyles()} onKeyDown={this.onKeyDown}>
      <MenuBg {...props} />
      <MenuFg {...props} />
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
    return <div>
      <Menu2dReact {...this.props} />
      <Menu2dCanvas {...this.props} />
    </div>;
  }
}

class Menu2dReact extends React.Component {
  getStyles() {
    return {
      pointerEvents: 'all',
    };
  }

  getLeftStyles() {
    const {open} = this.props;
    return _getLeftStyles({open, solid: true});
  }

  getRightStyles() {
    const {open} = this.props;
    return _getRightStyles({open, solid: true});
  }

  render() {
    const {tab, item, engines} = this.props;

    return <div style={this.getStyles()}>
      <div style={this.getLeftStyles()}>
        <MenuTabs tab={tab} engines={engines} />
        <MenuInfo tab={tab} item={item} />
      </div>
      <div style={this.getRightStyles()}>
        <MenuStats />
      </div>
    </div>;
  }
}

class MenuTabs extends React.Component {
  getStyles() {
    return {
      display: 'flex',
    }
  }

  render() {
    const {tab: selectedTab, engines} = this.props;

    return <div style={this.getStyles()}>
      {MENU_TABS.map((tab, i, a) => {
        const {name, value} = tab;
        const selected = selectedTab === name;
        const first = i === 0;
        const last = i === a.length - 1;
        return <MenuTab name={name} value={value} selected={selected} first={first} last={last} engines={engines} key={name} />;
      })}
    </div>;
  }
}

class MenuTab extends React.Component {
  state = {
    hovered: false
  };

  getStyles() {
    const {selected} = this.props;

    return {
      display: 'flex',
      position: 'relative',
      flex: 1,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: !selected ? 'pointer' : null,
    };
  }

  getBorderHorizontalStyles(side) {
    const {selected, first, last} = this.props;

    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: side === 'left' ? 0 : null,
      right: side === 'right' ? 0 : null,
      borderWidth: 0,
      borderLeftWidth: (side === 'left' && !first) ? 2 : null,
      borderRightWidth: (side === 'right' && !last) ? 2 : null,
      borderStyle: 'solid',
      borderColor: selected ? MENU_BORDER_COLOR : 'transparent',
    };
  }

  getBorderVerticalStyles(side) {
    const {selected} = this.props;

    return {
      position: 'absolute',
      top: side === 'top' ? 0 : null,
      bottom: side === 'bottom' ? 0 : null,
      left: side === 'top' ? 2 : 0,
      right: side === 'top' ? 2 : 0,
      borderWidth: 0,
      borderTopWidth: side === 'top' ? 2 : null,
      borderBottomWidth: side === 'bottom' ? 2 : null,
      borderStyle: 'solid',
      borderColor: (() => {
        if (side === 'top') {
          return selected ? MENU_BORDER_COLOR : 'transparent';
        } else if (side === 'bottom') {
          return selected ? 'transparent' : MENU_BORDER_COLOR;
        } else {
          return null;
        }
      })(),
    };
  }

  onMouseOver = () => {
    this.setState({
      hovered: true
    });
  };

  onMouseOut = () => {
    this.setState({
      hovered: false
    });
  };

  onClick = () => {
    const {name, engines} = this.props;
    const menuEngine = engines.getEngine('menu');
    menuEngine.selectTab(name);
  };

  render() {
    const {value, selected} = this.props;
    const {hovered} = this.state;

    return <div style={this.getStyles()} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}>
      <FontAwesome
        width={32}
        height={32}
        pixelation={MENU_CANVAS_PIXELATION}
        fontSize={12}
        color='#000'
        value={value}
        x={10.5}
        y={14}
        selected={selected}
        hovered={hovered}
      />
      <div style={this.getBorderHorizontalStyles('left')} />
      <div style={this.getBorderHorizontalStyles('right')} />
      <div style={this.getBorderVerticalStyles('bottom')} />
    </div>;
  }
}

class FontAwesome extends React.Component {
  componentDidMount() {
    const canvas = this.domNode();
    const ctx = canvas.getContext('2d');

    this._canvas = canvas;
    this._ctx = ctx;

    // async to let the font load + initialize
    requestAnimationFrame(() => {
      this.refresh(this.props);
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    const {selected: newSelected, hovered: newHovered} = nextProps;
    const {selected: oldSelected, hovered: oldHovered} = this.props;

    if (newSelected !== oldSelected || newHovered !== oldHovered) {
      this.refresh(nextProps);
    }
  }

  refresh(props) {
    const {fontSize, color, value, x, y, selected, hovered} = props;
    const {_canvas: canvas, _ctx: ctx} = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px FontAwesome';
    ctx.fillStyle = (selected || hovered) ? color : '#999';
    ctx.textAlign='center';
    ctx.fillText(value, x, y);
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  getCanvasStyles() {
    const {width, height} = this.props;

    return {
      width,
      height,
      imageRendering: 'pixelated',
    };
  }

  render() {
    const {width, height, pixelation} = this.props;

    return <canvas width={width / pixelation} height={height / pixelation} style={this.getCanvasStyles()}/>;
  }
}

class MenuInfo extends React.Component {
  getStyles() {
    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTop: '2px solid #333',
    };
  }

  getWrapperStyles() {
    return {
      padding: '20px',
    };
  }

  getHeadingStyles() {
    return {
      paddingBottom: '10px',
      fontSize: 12,
      // lineHeight: 1.4,
      color: '#333',
      textShadow: '0 2px rgba(255,255,255,0.35)',
    };
  }

  getParagraphStyles() {
    return {
      fontSize: 10,
      lineHeight: 1.4,
      color: '#666',
    };
  }

  render() {
    const {item} = this.props;

    if (item) {
      return <div style={this.getStyles()}>
        <div style={this.getWrapperStyles()}>
          <div style={this.getHeadingStyles()}>{_itemName(item)}</div>
          <div style={this.getParagraphStyles()}>Final Fantasy VII is a role-playing video game developed and published by Square (now Square Enix) for the PlayStation platform.</div>
        </div>
      </div>;
    } else {
      return null;
    }
  }
}

class MenuStats extends React.Component {
  getStyles() {
    return {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 300,
      width: '100%',
    };
  }

  render() {
    return <div style={this.getStyles()}>
      <MenuStatsBar label='HP' value={2263 * 0.75} total={2263} colors={['#5AD427', '#A4E786']} />
      <MenuStatsBar label='MP' value={177 * 0.4} total={177} colors={['#1D77EF', '#81F3FD']} />
      <MenuStatsBar label='Str' value={124} total={124} colors={['#FB2B69', '#FF5B37']} />
      <MenuStatsBar label='Def' value={124} total={124} colors={['#F7F7F7', '#D7D7D7']} />
      <MenuStatsBar label='Mag' value={124} total={124} colors={['#C86EDF', '#E4B7F0']} />
      <MenuStatsBar label='Spd' value={124} total={124} colors={['#FF9500', '#FF5E3A']} />
    </div>;
  }
}

class MenuStatsBar extends React.Component {
  getStyles() {
    return {
      padding: '5px 20px',
    };
  }

  getLabelsStyles() {
    return {
      display: 'flex',
      paddingBottom: 5,
      fontSize: 10,
      textShadow: '0 2px rgba(255,255,255,0.35)',
    };
  }

  getLabelStyles() {
    return {
      flex: '1',
    };
  }

  getTotalStyles() {
    return {
      color: '#808080',
      alignContent: 'flex-end',
    };
  }

  getBarWrapperStyles() {
    return {
      height: 4,
      width: MENU_BAR_WIDTH,
      backgroundColor: 'rgba(0,0,0,0.5)',
      border: '2px solid transparent',
    };
  }

  getBarContainerStyles() {
    const {value, total} = this.props;

    return {
      height: '100%',
      width: ((value / total) * 100) + '%',
      overflow: 'hidden'
    };
  }

  getBarStyles() {
    const {colors} = this.props;

    return {
      height: '100%',
      width: MENU_BAR_WIDTH,
      backgroundImage: 'linear-gradient(to right, ' + colors.join(',') + ')',
    };
  }

  render() {
    const {label, total} = this.props;

    return <div style={this.getStyles()}>
      <div style={this.getLabelsStyles()}>
        <div style={this.getLabelStyles()}>{label}</div>
        <div style={this.getTotalStyles()}>{total}</div>
      </div>
      <div style={this.getBarWrapperStyles()}>
        <div style={this.getBarContainerStyles()}>
          <div style={this.getBarStyles()} />
        </div>
      </div>
    </div>;
  }
}

class Menu2dCanvas extends React.Component {
  getLeftStyles() {
    const {open} = this.props;
    return {
      position: 'absolute',
      top: 40,
      left: ((MENU_WIDTH - MENU_CANVAS_WIDTH) / 2) + (open ? 0 : -MENU_WIDTH),
      transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
      pointerEvents: 'all',
    };
  }

  render() {
    return <div>
      <div style={this.getLeftStyles()}>
        <Menu2dCanvasLeft {...this.props} />
      </div>
    </div>;
  }
}

class Menu2dCanvasLeft extends React.Component {
  componentDidMount() {
    const {filteredInventory} = this.props;

    const width = MENU_CANVAS_WIDTH;
    const height = MENU_CANVAS_WIDTH;

    const canvas = document.createElement('canvas');
    canvas.width = width / MENU_CANVAS_PIXELATION;
    canvas.height = height / MENU_CANVAS_PIXELATION;
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.imageRendering = 'pixelated';
    const ctx = canvas.getContext('2d');
    const domNode = this.domNode();
    domNode.appendChild(canvas);

    const placeholderObjects = _renderPlaceholderObjects(filteredInventory);
    placeholderObjects.forEach(placeholderObject => {
      placeholderObject.updateMatrixWorld();
    });
    const placeholderCamera = _getBlockCamera(width, height);
    placeholderCamera.updateMatrixWorld();

    this._canvas = canvas;
    this._ctx = ctx;
    this._placeholderObjects = placeholderObjects;
    this._placeholderCamera = placeholderCamera;

    this.refresh(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {filteredInventory: newFilteredInventory} = nextProps;
    const {filteredInventory: oldFilteredInventory} = this.props;
    if (!Immutable.is(newFilteredInventory, oldFilteredInventory)) {
      const placeholderObjects = _renderPlaceholderObjects(newFilteredInventory);
      placeholderObjects.forEach(placeholderObject => {
        placeholderObject.updateMatrixWorld();
      });
      this._placeholderObjects = placeholderObjects;
    }

    const {item: newItem} = nextProps;
    const {item: oldItem} = this.props;
    if (!Immutable.is(newItem, oldItem)) {
      this.refresh(nextProps);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  getItemOffset(x, y) {
    const {_canvas: canvas, _placeholderObjects: placeholderObjects, _placeholderCamera: placeholderCamera} = this;
    const {width, height} = canvas;

    const placeholderObjectIndex = x + y * 4;
    const placeholderObject = placeholderObjects[placeholderObjectIndex];

    const vector = new THREE.Vector3();
    vector.setFromMatrixPosition(placeholderObject.matrixWorld);
    vector.project(placeholderCamera);

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    const left = vector.x;
    const top = vector.y;

    return {left, top};
  }

  refresh(props) {
    const {itemIndex} = props;
    const {_canvas: canvas, _ctx: ctx} = this;

    const {width, height} = canvas;
    ctx.clearRect(0, 0, width, height);

    if (itemIndex !== null) {
      const x = itemIndex % 4;
      const y = floor(itemIndex / 4);

      for (let i = 0; i < 4; i++) {
        const offset = this.getItemOffset(x, y);
        let {left, top} = offset;
        switch (i) {
          case 0:
            left += (0.2 / 4) * width;
            top += (0.2 / 4) * height;
            break;
          case 1:
            left -= (0.2 / 4) * width;
            top += (0.2 / 4) * height;
            break;
          case 2:
            left -= (0.2 / 4) * width;
            top -= (0.2 / 4) * height;
            break;
          case 3:
            left += (0.2 / 4) * width;
            top -= (0.2 / 4) * height;
            break;
        }

        ctx.beginPath();
        const baseAngle = (Math.PI / 2) * i;
        ctx.arc(left, top, 5, baseAngle + Math.PI / 4 - Math.PI / 4, baseAngle + Math.PI / 4 + Math.PI / 4);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
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

  getDragStyles() {
    const {dragItem} = this.props;
    return {
      display: dragItem ? null : 'none',
    };
  }

  render() {
    return <div>
      <div style={this.getLeftStyles()}>
        <Menu3dLeft {...this.props} />
      </div>
      <div style={this.getDragStyles()}>
        <Menu3dDrag {...this.props} />
        <MenuDragMask {...this.props} />
      </div>
    </div>;
  }
}

class Menu3dLeft extends React.Component {
  componentWillMount() {
    _ManualRefreshMenuComponent.componentWillMount.call(this);
  }

  componentWillUnmount() {
    _ManualRefreshMenuComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshMenuComponent.shouldComponentUpdate.call(this);
  }

  componentDidMount() {
    const width = MENU_CANVAS_WIDTH;
    const height = MENU_CANVAS_WIDTH;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    renderer.setSize(width / MENU_CANVAS_PIXELATION, height / MENU_CANVAS_PIXELATION);
    const canvas = renderer.domElement;
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.imageRendering = 'pixelated';

    const scene = new THREE.Scene();
    const camera = _getBlockCamera(width, height);

    const domNode = this.domNode();
    domNode.appendChild(canvas);

    this._menu = {
      renderer,
      scene,
      camera,
      object: null,
    };

    this.updateItems(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {tab: newTab} = nextProps;
    const {tab: oldTab} = this.props;

    if (newTab !== oldTab) {
      this.updateItems(nextProps);
    }
  }

  updateItems(props) {
    const {_menu: menu} = this;
    const {scene, object: oldObject} = menu;

    if (oldObject) {
      scene.remove(oldObject);
    }

    const {filteredInventory} = props;
    const newObject = _renderItems(filteredInventory);
    scene.add(newObject);
    menu.object = newObject;
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  getStyles() {
    return {
      position: 'absolute',
      top: 40,
      left: (MENU_WIDTH - MENU_CANVAS_WIDTH) / 2,
      pointerEvents: 'all',
    };
  }

  getItemIndex(x, y) {
    return x + y * 4;
  }

  getEventItemIndex(e) {
    const {pageX, pageY} = e;
    const domNode = this.domNode();
    const domNodeOffset = $(domNode).offset();
    const {top, left} = domNodeOffset;
    const relativeX = pageX - left;
    const relativeY = pageY - top;
    const width = $(domNode).width();
    const height = $(domNode).height();
    const x = floor((relativeX / width) * 4);
    const y = floor((relativeY / height) * 4);
    const itemIndex = this.getItemIndex(x, y);
    return itemIndex;
  }

  onMouseDown = e => {
    const {filteredInventory} = this.props;
    const itemIndex = this.getEventItemIndex(e);
    const item = filteredInventory.get(itemIndex);
    const {engines} = this.props;
    const menuEngine = engines.getEngine('menu');
    if (item) {
      menuEngine.selectItem(itemIndex);
    } else {
      menuEngine.selectItem(null);
    }
  };

  onDragStart = e => {
    const {itemIndex: oldItemIndex, filteredInventory} = this.props;
    const itemIndex = this.getEventItemIndex(e);
    const item = filteredInventory.get(itemIndex);
    const {engines} = this.props;
    const menuEngine = engines.getEngine('menu');
    if (item) {
      const {pageX: x, pageY: y} = e;
      menuEngine.startDrag({itemIndex, x, y});
    }

    e.preventDefault();
  };

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  refresh() {
    const {renderer, scene, camera, object} = this._menu;

    if (object) {
      object.refresh();
    }

    renderer.render(scene, camera);
  }

  render() {
    return <div style={this.getStyles()} onMouseDown={this.onMouseDown} onDragStart={this.onDragStart} draggable />;
  }
}

class MenuDragMask extends React.Component {
  getStyles() {
    return {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      cursor: '-webkit-grabbing',
      pointerEvents: 'all',
    };
  }

  onMouseMove = e => {
    const {pageX: x, pageY: y} = e;
    const {engines} = this.props;
    const menuEngine = engines.getEngine('menu');
    menuEngine.updateDrag({x, y});

    e.preventDefault();
  };

  onMouseUp = e => {
    const {engines} = this.props;
    const menuEngine = engines.getEngine('menu');
    menuEngine.endDrag();

    e.preventDefault();
  };

  render() {
    return <div style={this.getStyles()} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} />;
  }
}

class Menu3dDrag extends React.Component {
  getStyles() {
    const {dragCoords} = this.props;
    if (dragCoords) {
      const {x, y} = dragCoords;
      return {
        position: 'absolute',
        left: -(MENU_CANVAS_WIDTH / 2) + x,
        top: -(MENU_CANVAS_WIDTH / 2) + y,
      };
    } else {
      return null;
    }
  }

  render() {
    return <div style={this.getStyles()}>
      <Menu3dDragIcon {...this.props} />
    </div>;
  }
}

class Menu3dDragIcon extends React.Component {
  componentWillMount() {
    _ManualRefreshMenuComponent.componentWillMount.call(this);
  }

  componentWillUnmount() {
    _ManualRefreshMenuComponent.componentWillUnmount.call(this);
  }

  shouldComponentUpdate() {
    return _ManualRefreshMenuComponent.shouldComponentUpdate.call(this);
  }

  componentDidMount() {
    const width = MENU_CANVAS_WIDTH;
    const height = MENU_CANVAS_WIDTH;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    renderer.setSize(width / MENU_CANVAS_PIXELATION, height / MENU_CANVAS_PIXELATION);
    const canvas = renderer.domElement;
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.imageRendering = 'pixelated';

    const scene = new THREE.Scene();
    const camera = _getBlockCamera(width, height);

    const domNode = this.domNode();
    domNode.appendChild(canvas);

    this._menu = {
      renderer,
      scene,
      camera,
      object: null,
    };

    this.updateItem(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {dragItemIndex: newDragItemIndex, dragCoords: newDragCoords} = nextProps;
    const {dragItemIndex: oldDragItemIndex, dragCoords: oldDragCoords} = this.props;

    if (newDragItemIndex !== oldDragItemIndex || !Immutable.is(newDragCoords, oldDragCoords)) {
      this.updateItem(nextProps);
    }
  }

  updateItem(props) {
    const {_menu: menu} = this;
    const {scene, object: oldObject} = menu;

    if (oldObject) {
      scene.remove(oldObject);
    }

    const {dragItem} = props;
    if (dragItem) {
      const newObject = _renderItem(dragItem);
      scene.add(newObject);
      menu.object = newObject;
    } else {
      menu.object = null;
    }
  }

  domNode() {
    return ReactDOM.findDOMNode(this);
  }

  refresh() {
    const {renderer, scene, camera, object} = this._menu;

    if (object) {
      object.refresh();
    }

    renderer.render(scene, camera);
  }

  render() {
    return <div />;
  }
}

const _ManualRefreshMenuComponent = {
  componentWillMount() {
    this._timeout = null;
    this._frame = null;

    _ManualRefreshMenuComponent.listen.call(this);
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

function _getLeftStyles({open, solid}) {
  return {
    position: 'absolute',
    left: open ? 0 : -MENU_WIDTH,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: solid ? ('rgba(255, 255, 255, ' + MENU_FG_DIM + ')') : null,
    transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
  };
}

function _getRightStyles({open, solid}) {
  return {
    position: 'absolute',
    right: open ? 0 : -MENU_WIDTH,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: solid ? ('rgba(255, 255, 255, ' + MENU_FG_DIM + ')') : null,
    transition: 'all ' + MENU_TIME + 's ' + MENU_TRANSITION_FN,
  };
}

function _makeCubeGeometry() {
  const cubeGeometry = new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const bufferGeometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry);
  return bufferGeometry;
}

function _makeCubeGradientGeometry(gradient) {
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

function _getBlockCamera(width, height) {
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 1000);
  camera.position.set(0, 0, 10);
  return camera;
}

const CUBE_FULL_MATERIALS = [
  new THREE.MeshBasicMaterial({
    // shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors,
    // opacity: 0.9,
    // transparent: true
  }),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.8,
    wireframe: true,
    // wireframeLinewidth: 1.5,
    // transparent: true
  }),
];

function _renderItem(item) {
  const {type, count} = item;

  const mesh = (() => {
    function emptyMesh() {
      const geometry = _makeCubeGeometry();
      const material = CUBE_EMPTY_MATERIAL;
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    }

    function blockMesh() {
      const {variant} = item;
      // XXX finish this
      const geometry = _makeCubeGeometry();
      const material = CUBE_EMPTY_MATERIAL;
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    }

    function materiaMesh() {
      const {variant} = item;
      const hash = murmur(variant);
      const gradient = GRADIENTS[hash % GRADIENTS.length];
      const geometry = _makeCubeGradientGeometry(gradient);
      const materials = CUBE_FULL_MATERIALS;
      const mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
      return mesh;
    }

    if (count < 5) {
      return emptyMesh();
    } else {
      switch (type) {
        case 'block':
          return blockMesh();
        case 'materia':
          return materiaMesh();
        default: // XXX finish this
          return materiaMesh();
      }
    }
  })();

  mesh.refresh = () => {
    const time = new Date();
    const timeFactor = (+time % CUBE_ROTATION_RATE) / CUBE_ROTATION_RATE;
    const rotationFactor = timeFactor * Math.PI * 2;
    mesh.rotation.set(0, rotationFactor, rotationFactor);
  };

  return mesh;
}

function _renderItems(inventory) {
  const object = new THREE.Object3D();

  const items = [];
  inventory.forEach((item, i) => {
    const mesh = _renderItem(item);

    const x = i % 4;
    const y = floor(i / 4);
    mesh.position.set(-3 + x * 2, -(-3 + y * 2), 0);
    mesh.rotation.order = 'XYZ';

    items.push(mesh);
  });
  items.forEach(mesh => {
    object.add(mesh);
  });

  object.refresh = function() {
    const time = new Date();
    const timeFactor = (+time % CUBE_ROTATION_RATE) / CUBE_ROTATION_RATE;
    const rotationFactor = timeFactor * Math.PI * 2;
    items.forEach((mesh, i) => {
      const localRotationFactor = rotationFactor + (((i % 4) / 4) * Math.PI * 2);
      mesh.rotation.set(0, localRotationFactor, localRotationFactor);
    });
  };

  return object;
}

function _renderPlaceholderObjects(inventory) {
  const result = [];
  inventory.forEach((item, i) => {
    const x = i % 4;
    const y = floor(i / 4);

    const geometry = new THREE.Geometry();
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-3 + x * 2, -(-3 + y * 2), 0);
    result.push(mesh);
  });
  return result;
}

function _itemName(item) {
  const {type, variant} = item;

  switch (type) {
    case 'block':
      return _blockName(variant);
    case 'materia':
      return _materiaName(variant);
    default: // XXX finish this
      return '<unknown>'
  }
}

function _blockName(variant) {
  const index = variant - 1;
  const faces = BLOCKS.MATERIALS[index];
  const material = faces[0];
  const name = _capitalize(
    material
      .replace(/_/g, ' ')
      .replace(/(top|stage|[\s0-9])+$/g, '')
  );
  return name;
}

function _materiaName(variant) {
  return _capitalize(variant);
}

function _capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
