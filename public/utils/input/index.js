export const KEYS = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESCAPE: 27,
  SPACE: 32,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53
};
export const KEY_NAMES = Object.keys(KEYS);

export const WASD = {
  UP: 'W',
  DOWN: 'S',
  LEFT: 'A',
  RIGHT: 'D',
};

export const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};
export const MOUSE_BUTTON_NAMES = Object.keys(MOUSE_BUTTONS);

export function getDownKeys(keys) {
  const result = {};

  for (let i = 0; i < KEY_NAMES.length; i++) {
    const key = KEY_NAMES[i];
    const keyIndex = KEYS[key];
    result[key] = Boolean(keys.get(String(keyIndex)));
  }

  return result;
}

export function getPressedKeys(oldDownKeys, newDownKeys) {
  const result = {};

  for (let i = 0; i < KEY_NAMES.length; i++) {
    const key = KEY_NAMES[i];
    const oldKey = Boolean(oldDownKeys[key]);
    const newKey = Boolean(newDownKeys[key]);
    result[key] = oldKey && !newKey;
  }

  return result;
}

export function getDownMouseButtons(mouseButtons) {
  const result = {};

  for (let i = 0; i < MOUSE_BUTTON_NAMES.length; i++) {
    const button = MOUSE_BUTTON_NAMES[i];
    const buttonIndex = MOUSE_BUTTONS[button];
    result[button] = Boolean(mouseButtons.get(String(buttonIndex)));
  }

  return result;
}

export function getPressedMouseButtons(oldMouseButtons, newMouseButtons) {
  const result = {};

  for (let i = 0; i < MOUSE_BUTTON_NAMES.length; i++) {
    const button = MOUSE_BUTTON_NAMES[i];
    const oldButton = Boolean(oldMouseButtons[button]);
    const newButton = Boolean(newMouseButtons[button]);
    result[button] = oldButton && !newButton;
  }

  return result;
}
