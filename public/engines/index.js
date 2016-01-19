import Point from '../records/point/index';
import Vector from '../records/vector/index';

import * as inputUtils from '../utils/input/index';

const FRAME_RATE = 30;
const MOVE_PER_FRAME = 4 / FRAME_RATE;
const MOVE_PER_FRAME_FAST = MOVE_PER_FRAME * 2.5;
const GRAVITY_PER_FRAME = 1 / FRAME_RATE;
const JUMP_VELOCITY = 0.35;
const ROTATE_PER_FRAME = (Math.PI * 2 / (10e4)) / FRAME_RATE;

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
  }

  listenKeyboard() {
    const $window = $(window);
    $window.on('keydown', e => {
      this.updateState('window', oldState => oldState.setIn([ 'keys', String(e.which) ], true));
    });
    $window.on('keyup', e => {
      this.updateState('window', oldState => oldState.setIn([ 'keys', String(e.which) ], false));
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
      const updateWorld = ({framesPassed, downKeys, position, velocity, downMouseButtons, oldMousePosition, newMousePosition, width}) => {
        return oldState => {
          let state = oldState;

          // movment
          state = (() => {
            const move = angle => {
              const rotation = state.get('rotation');
              const directionAngle = rotation.x + angle;
              const x = Math.sin(directionAngle);
              const y = Math.cos(directionAngle);
              const diffVector = new Vector(x, 0, -y).multiplyScalar((!downKeys.shift ? MOVE_PER_FRAME : MOVE_PER_FRAME_FAST) * framesPassed);

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

            if (downKeys.up && !downKeys.down) {
              angles.push(0);
            } else if (downKeys.down && !downKeys.up) {
              angles.push(Math.PI);
            }
            if (downKeys.left && !downKeys.right) {
              angles.push(-(Math.PI / 2));
            } else if (downKeys.right && !downKeys.left) {
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
            if (downMouseButtons.left) {
              const xDiff = newMousePosition.x - oldMousePosition.x;
              const yDiff = newMousePosition.y - oldMousePosition.y;
              const c = ROTATE_PER_FRAME * width * framesPassed;
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
          })();

          // jumping
          state = (() => {
            if (downKeys.space) {
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

          return state;
        };
      };
      const updateWindow = () => {
        return oldState => {
          let state = oldState;
          state = (() => {
            const mousePosition = state.getIn(['mouse', 'position']);
            return state.setIn(['mouse', 'oldPosition'], mousePosition);
          })();
          return state;
        };
      };

      const windowState = this.getState('window');
      const worldState = this.getState('world');

      const {keys} = windowState;
      const downKeys = inputUtils.getDownKeys(keys);
      const {position, velocity} = worldState;

      const mouseButtons = windowState.getIn(['mouse', 'buttons']);
      const downMouseButtons = inputUtils.getDownMouseButtons(mouseButtons);

      const oldMousePosition = windowState.getIn(['mouse', 'oldPosition']);
      const newMousePosition = windowState.getIn(['mouse', 'position']);
      const {width} = windowState;

      this.updateState('world', updateWorld({framesPassed, downKeys, position, velocity, downMouseButtons, oldMousePosition, newMousePosition, width}));
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
}
