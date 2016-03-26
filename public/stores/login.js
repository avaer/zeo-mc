import Immutable from 'immutable';

export default class Login extends Immutable.Record({
  user: null,
  session: null,
  loggedIn: false,
  loggingIn: false,
  error: null,
}) {}
