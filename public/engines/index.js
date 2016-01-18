import Vector from '../records/vector/index';

const FRAME_RATE = 30;
const MOVE_PER_FRAME = 0.2;
const KEYS = {
  W: 87,
  S: 83,
  A: 65,
  D: 68
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

      const updateWorld = downKeys => {
        return oldState => {
          if (downKeys.up) {
            return oldState.update('position', Vector.bindAdd(new Vector(0, 0, 1)));
          } else if (downKeys.down) {
            return oldState.update('position', Vector.bindAdd(new Vector(0, 0, -1)));
          } else if (downKeys.left) {
            return oldState.update('position', Vector.bindAdd(new Vector(-1, 0, 0)));
          } else if (downKeys.right) {
            return oldState.update('position', Vector.bindAdd(new Vector(1, 0, 0)));
          } else {
            return oldState;
          }
        };
      }

      const windowState = this.getState('window');
      const keys = windowState.get('keys');
      const downKeys = getDownKeys(keys);
      this.updateState('world', updateWorld(downKeys));
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
    // XXX
  }
}
