import Immutable from 'immutable';

class Keys extends Immutable.Map {}

class MouseButtons extends Immutable.Map {}
class MousePosition extends Immutable.Record({
  x: 0,
  y: 0
}) {}
class Mouse extends Immutable.Record({
  buttons: new MouseButtons(),
  oldButtons: new MouseButtons(),
  position: new MousePosition(),
  oldPosition: new MousePosition(),
}) {}

export default class Window extends Immutable.Record({
  width: 0,
  height: 0,
  pixelRatio: 1,
  pathname: '',
  keys: new Keys(),
  oldKeys: new Keys(),
  mouse: new Mouse()
}) {}
