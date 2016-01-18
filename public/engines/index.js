import Point from '../records/point/index';
import Vector from '../records/vector/index';

const FRAME_RATE = 30;
const MOVE_PER_FRAME = 0.2;
const ROTATE_PER_FRAME = Math.PI / 100;
const KEYS = {
  W: 87,
  S: 83,
  A: 65,
  D: 68
};
const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};

function updateWindow(oldState) {
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
    this.updateState('window', updateWindow);
  }

  listen() {
    this.listenFrame();
    this.listenWindow();
    this.listenKeyboard();
  }

  listenFrame() {
    let lastFrameTime = new Date();

    const handleFrames = framesPassed => {
      const getDownKeys = keys => {
        return {
          up: keys.get(String(KEYS.W)),
          down: keys.get(String(KEYS.S)),
          left: keys.get(String(KEYS.A)),
          right: keys.get(String(KEYS.D))
        };
      };
      const getDownMouseButtons = mouseButtons => {
        return {
          left: keys.get(String(MOUSE_BUTTONS.LEFT)),
          middle: keys.get(String(MOUSE_BUTTONS.MIDDLE)),
          right: keys.get(String(MOUSE_BUTTONS.RIGHT))
        };
      };
      /* const getMouseDiff = (oldMousePosition, newMousePosition) => {
        return {
          x: newMousePosition.x - oldMousePosition.x,
          y: newMousePosition.y - oldMousePosition.y
        };
      }); */

      const updateWorld = ({framesPassed, downKeys, downMouseButtons, oldMousePosition, newMousePosition}) => {
        return oldState => {
          let state = oldState;
          state = (() => {
            if (downKeys.up) {
              return state.update('position', Vector.bindAdd(new Vector(0, 0, 1).multiplyScalar(MOVE_PER_FRAME * framesPassed)));
            } else if (downKeys.down) {
              return state.update('position', Vector.bindAdd(new Vector(0, 0, -1).multiplyScalar(MOVE_PER_FRAME * framesPassed)));
            } else if (downKeys.left) {
              return state.update('position', Vector.bindAdd(new Vector(-1, 0, 0).multiplyScalar(MOVE_PER_FRAME * framesPassed)));
            } else if (downKeys.right) {
              return state.update('position', Vector.bindAdd(new Vector(1, 0, 0).multiplyScalar(MOVE_PER_FRAME * framesPassed)));
            } else {
              return state;
            }
          })();
          state = (() => {
            if (downMouseButtons.left) {
              const xDiff = newMousePosition.x - oldMousePosition.x;
              const yDiff = newMousePosition.y - oldMousePosition.y;
              return state.update('rotation', Point.bindAdd(new Point(xDiff, yDiff).multiplyScalar(ROTATE_PER_FRAME * framesPassed)));
            } else {
              return state;
            }
          })();
          return state;
        };
      };
      const updateWindow = () => {
        return oldState => {
          let state = oldState;
          state = (() => {
            const mousePosition = state.get(['mouse', 'position']);
            return state.setIn(['mouse', 'oldPosition'], mousePosition);
          })();
          return state;
        };
      };

      const windowState = this.getState('window');

      const keys = windowState.get('keys');
      const downKeys = getDownKeys(keys);

      const mouseButtons = windowState.getIn(['mouse', 'buttons']);
      const downMouseButtons = getDownMouseButtons(mouseButtons);

      const oldMousePosition = windowState.getIn(['mouse', 'oldPosition']);
      const newMousePosition = windowState.getIn(['mouse', 'position']);

      this.updateState('world', updateWorld({framesPassed, downKeys, downMouseButtons, oldMousePosition, newMousePosition}));
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

  listenWindow() {
    const $window = $(window);
    $window.on('resize', () => {
      this.updateState('window', updateWindow);
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
      this.updateState('window', oldState => oldState.setIn([ 'mouse', 'buttons', String(e.which) ], true));
    });
    $window.on('mouseup', e => {
      this.updateState('window', oldState => oldState.setIn([ 'mouse', 'buttons', String(e.which) ], false));
    });
    $window.on('mousemove', e => {
      const {clientX: x, clientY: y} = e;
      this.updateState('window', oldState => oldState
        .setIn([ 'mouse', 'position', 'x' ], x)
        .setIn([ 'mouse', 'position', 'y' ], y));
    });
  }
}
