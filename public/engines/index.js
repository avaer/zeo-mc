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
    this.listenWindow();
    this.listenKeyboard();
  }

  listenWindow() {
    $(window).on('resize', () => {
      this.updateState('window', updateWindow);
    });
  }

  listenKeyboard() {
    // XXX
  }
}
