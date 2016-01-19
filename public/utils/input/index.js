export const KEYS = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  SHIFT: 16,
  SPACE: 32
};

export const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};

export function getDownKeys(keys) {
  return {
    up: keys.get(String(KEYS.W)),
    down: keys.get(String(KEYS.S)),
    left: keys.get(String(KEYS.A)),
    right: keys.get(String(KEYS.D)),
    shift: keys.get(String(KEYS.SHIFT)),
    space: keys.get(String(KEYS.SPACE))
  };
}

export function getDownMouseButtons(mouseButtons) {
  return {
    left: mouseButtons.get(String(MOUSE_BUTTONS.LEFT)),
    middle: mouseButtons.get(String(MOUSE_BUTTONS.MIDDLE)),
    right: mouseButtons.get(String(MOUSE_BUTTONS.RIGHT))
  };
}
