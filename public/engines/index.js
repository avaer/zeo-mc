import Immutable from 'immutable';

import Point from '../records/point/index';
import Vector from '../records/vector/index';
import Node from '../records/node/index';

import {FRAME_RATE, UI_MODES, TOOLS} from '../constants/index';
import * as inputUtils from '../utils/input/index';

const MOVE_PER_FRAME = 0.005 * FRAME_RATE;
const MOVE_PER_FRAME_FAST = MOVE_PER_FRAME * 2.5;
const GRAVITY_PER_FRAME = 0.0005 * FRAME_RATE;
const JUMP_VELOCITY = 0.175;
const ROTATE_PER_WIDTH = Math.PI * 2;

function syncWindow(oldState) {
  const $window = $(window);
  const width = $window.width();
  const height = $window.height();
  const pixelRatio = window.devicePixelRatio;

  return oldState
    .set('width', width)
    .set('height', height)
    .set('pixelRatio', pixelRatio);
}

export default class Engines {
  constructor(opts) {
    this._opts = opts;

    this.init();
    this.listen();
  }

  getState(name) {
    return this._opts.getState(name);
  }

  setState(name, newState) {
    return this._opts.setState(name, newState);
  }

  updateState(name, fn) {
    const oldState = this.getState(name);
    const newState = fn(oldState);
    this.setState(name, newState);
  }

  init() {
    this.initWindow();
  }

  initWindow() {
    this.updateState('window', syncWindow);
  }

  listen() {
    this.listenWindow();
    this.listenInput();
    this.listenFrame();
  }

  listenInput() {
    this.listenKeyboard();
    this.listenMouse();
  }

  listenWindow() {
    const $window = $(window);
    $window.on('resize', () => {
      this.updateState('window', syncWindow);
    });
    $window.on('blur', () => {
      this.updateState('window', oldState => oldState
        .set('keys', new Immutable.Map())
        .setIn([ 'mouse', 'buttons' ], new Immutable.Map()));
    });
  }

  listenKeyboard() {
    const $window = $(window);
    $window.on('keydown', e => {
      const {which} = e;
      this.updateState('window', oldState => oldState.setIn([ 'keys', String(which) ], true));

      const tool = inputUtils.TOOL_KEYS[which] || null;
      if (tool) {
        this.updateState('world', oldState => oldState.set('tool', tool));
      }
    });
    $window.on('keyup', e => {
      const {which} = e;
      this.updateState('window', oldState => oldState.setIn([ 'keys', String(which) ], false));
    });
  }

  listenMouse() {
    const $window = $(window);
    $window.on('mousedown', e => {
      this.updateState('window', oldState => oldState.setIn([ 'mouse', 'buttons', String(e.button) ], true));
    });
    $window.on('mouseup', e => {
      this.updateState('window', oldState => oldState.setIn([ 'mouse', 'buttons', String(e.button) ], false));
    });
    $window.on('mousemove', e => {
      const {clientX: x, clientY: y} = e;
      this.updateState('window', oldState => oldState
        .setIn([ 'mouse', 'position', 'x' ], x)
        .setIn([ 'mouse', 'position', 'y' ], y));
    });
  }

  listenFrame() {
    let lastFrameTime = new Date();

    const handleFrames = framesPassed => {
      const updateUi = ({mode, oldValue, pressedKeys, pressedMouseButtons, tool}) => {
        return oldState => {
          let state = oldState;

          // modes
          state = (() => {
            if (mode === UI_MODES.WORLD) {
              if (tool === TOOLS.PENCIL && pressedMouseButtons['LEFT']) {
                return state
                  .set('mode', UI_MODES.EDITOR)
                  .set('value', oldValue);
              } else {
                return state;
              }
            } else if (mode === UI_MODES.EDITOR) {
              if (pressedKeys['ESCAPE']) {
                return state.set('mode', UI_MODES.WORLD);
              } else {
                return state;
              }
            } else {
              return state;
            }
          })();

          return state;
        };
      };
      const updateWorld = ({mode, framesPassed, downKeys, position, velocity, downMouseButtons, oldMousePosition, newMousePosition, width}) => {
        return oldState => {
          let state = oldState;

          if (mode === UI_MODES.WORLD) {
            // movment
            state = (() => {
              const move = angle => {
                const rotation = state.get('rotation');
                const directionAngle = rotation.x + angle;
                const x = Math.sin(directionAngle);
                const y = Math.cos(directionAngle);
                const diffVector = new Vector(x, 0, -y).multiplyScalar((!downKeys['SHIFT'] ? MOVE_PER_FRAME : MOVE_PER_FRAME_FAST) * framesPassed);

                return Vector.bindAdd(diffVector);
              };
              const normalize = a => {
                if (a.some(e => e === Math.PI) && a.some(e => e === -(Math.PI / 2))) {
                  return a.map(e => ((e >= 0) ? e : (e + (Math.PI * 2))));
                } else {
                  return a.slice();
                }
              };
              const avg = a => {
                const l = a.length;
                if (l > 0) {
                  let result = 0;
                  for (var i = 0; i < l; i++) {
                    result += a[i];
                  }
                  return result / l;
                } else {
                  return 0;
                }
              };
              let angles = [];

              if (downKeys[inputUtils.WASD.UP] && !downKeys[inputUtils.WASD.DOWN]) {
                angles.push(0);
              } else if (downKeys[inputUtils.WASD.DOWN] && !downKeys[inputUtils.WASD.UP]) {
                angles.push(Math.PI);
              }
              if (downKeys[inputUtils.WASD.LEFT] && !downKeys[inputUtils.WASD.RIGHT]) {
                angles.push(-(Math.PI / 2));
              } else if (downKeys[inputUtils.WASD.RIGHT] && !downKeys[inputUtils.WASD.LEFT]) {
                angles.push(Math.PI / 2);
              }

              if (angles.length > 0) {
                return state.update('position', move(avg(normalize(angles))));
              } else {
                return state;
              }
            })();

            // rotation
            state = (() => {
              const worldState = this.getState('world');
              const {tool} = worldState;

              if (tool === TOOLS.MAGNIFYING_GLASS) {
                if (downMouseButtons['LEFT']) {
                  const xDiff = newMousePosition.x - oldMousePosition.x;
                  const yDiff = newMousePosition.y - oldMousePosition.y;
                  const c = ROTATE_PER_WIDTH / width;
                  return state.update('rotation', rotation => rotation
                    .update('x', x => {
                       let result = x + (xDiff * c);
                       while (result / Math.PI < -1) {
                         result += Math.PI * 2;
                       }
                       while (result / Math.PI > 1) {
                         result -= Math.PI * 2;
                       }
                       return result;
                    })
                    .update('y', y => Math.min(Math.max(y + (yDiff * c), -(Math.PI / 2)), Math.PI / 2)));
                } else {
                  return state;
                }
              } else {
                return state;
              }
            })();

            // jumping
            state = (() => {
              if (downKeys['SPACE']) {
                const {y: yv} = velocity;
                if (yv === 0) {
                  velocity = velocity.set('y', JUMP_VELOCITY);
                  return state.set('velocity', velocity);
                } else {
                  return state;
                }
              } else {
                return state;
              }
            })();

            // falling
            state = (() => {
              const {y} = position;
              const {y: yv} = velocity;
              const newY = Math.max(y + yv, 0);
              const newYv = (newY > 0) ? (yv - (GRAVITY_PER_FRAME * framesPassed)) : 0;

              return state
                .setIn(['position', 'y'], newY)
                .setIn(['velocity', 'y'], newYv);
            })();
          }

          return state;
        };
      };
      const updateWindow = () => {
        return oldState => {
          let state = oldState;

          state = (() => {
            const keys = state.get('keys');
            const mouseButtons = state.getIn(['mouse', 'buttons']);
            const mousePosition = state.getIn(['mouse', 'position']);

            return state
              .set('oldKeys', keys)
              .setIn(['mouse', 'oldButtons'], mouseButtons)
              .setIn(['mouse', 'oldPosition'], mousePosition);
          })();

          return state;
        };
      };

      const uiState = this.getState('ui');
      const windowState = this.getState('window');
      const worldState = this.getState('world');

      const {mode, oldValue} = uiState;

      const {width} = windowState;

      const oldKeys = windowState.get('oldKeys');
      const oldDownKeys = inputUtils.getDownKeys(oldKeys);
      const keys = windowState.get('keys');
      const downKeys = inputUtils.getDownKeys(keys);
      const pressedKeys = inputUtils.getPressedKeys(oldDownKeys, downKeys);

      const oldMouseButtons = windowState.getIn(['mouse', 'oldButtons']);
      const oldDownMouseButtons = inputUtils.getDownMouseButtons(oldMouseButtons);
      const mouseButtons = windowState.getIn(['mouse', 'buttons']);
      const downMouseButtons = inputUtils.getDownMouseButtons(mouseButtons);
      const pressedMouseButtons = inputUtils.getPressedMouseButtons(oldDownMouseButtons, downMouseButtons);

      const oldMousePosition = windowState.getIn(['mouse', 'oldPosition']);
      const newMousePosition = windowState.getIn(['mouse', 'position']);

      const {position, velocity, tool} = worldState;

      this.updateState('ui', updateUi({mode, oldValue, pressedKeys, pressedMouseButtons, tool}));
      this.updateState('world', updateWorld({mode, framesPassed, downKeys, position, velocity, downMouseButtons, oldMousePosition, newMousePosition, width}));
      this.updateState('window', updateWindow());
    };

    const frame = () => {
      const now = new Date();
      const timePassed = +now - +lastFrameTime;
      const framesPassed = timePassed / FRAME_RATE;
      handleFrames(framesPassed);

      lastFrameTime = now;

      waitForFrame();
    };

    const waitForFrame = () => {
      setTimeout(frame, 1000 / FRAME_RATE);
    };

    waitForFrame();
  }

  hoverCoords(coords) {
    this.updateState('world', oldState => oldState.set('hoverCoords', coords));
  }

  hoverEndCoords(coords) {
    this.updateState('world', oldState => oldState.set('hoverEndCoords', coords));
  }

  hoverCommit({startCoords, endCoords}) {
    this.updateState('world', oldState => oldState.update('nodes', nodes => {
      const node = Node.fromCoords({startCoords, endCoords});
      return nodes.push(node);
    }));
  }

  editorChange({value}) {
    this.updateState('ui', oldState => oldState.set('value', value));
  }

  editorSave({value}) {
    this.updateState('ui', oldState => oldState.set('oldValue', value));
  }
}
