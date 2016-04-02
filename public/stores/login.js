import Immutable from 'immutable';

export default class Login extends Immutable.Record({
  user: null,
  session: null,
  world: null,
  mode: 'mainMenu',
  creatingUser: false,
  creatingWorld: false,
  worlds: Immutable.List(),
  error: null,
}) {}

export const Worlds = {
  create: worlds => Immutable.List(worlds.map(world => new World(world)))
};

export class World extends Immutable.Record({
  worldname: '',
  seed: '',
}) {}
