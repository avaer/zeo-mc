import {TOOLS} from '../../constants/index';

export const KEYS = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  SHIFT: 16,
  SPACE: 32,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53
};

export const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};

export const TOOL_KEYS = {
  [KEYS[1]]: TOOLS.MAGNIFYING_GLASS,
  [KEYS[2]]: TOOLS.PENCIL,
  [KEYS[3]]: TOOLS.WRENCH,
  [KEYS[4]]: TOOLS.ERASER,
  [KEYS[5]]: TOOLS.PAINTBRUSH
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
